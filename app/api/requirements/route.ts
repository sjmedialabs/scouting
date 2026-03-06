import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Requirement from "@/models/Requirement";
import { getCurrentUser } from "@/lib/auth/jwt"; // <-- IMPORTANT
import Seeker from "@/models/Seeker";
import { error } from "console";
import mongoose from "mongoose";
import Notification from "@/models/Notification";
import Provider from "@/models/Provider";

// GET Requirements
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const search = req.nextUrl.searchParams.get("search") || "";
    const category = req.nextUrl.searchParams.get("category") || "";
    const minBudget = Number(req.nextUrl.searchParams.get("minBudget") || 0);
    const maxBudget = Number(
      req.nextUrl.searchParams.get("maxBudget") || 9999999,
    );

    const query: any = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "all") {
      query.category = category;
    }

    query.budgetMin = { $lte: maxBudget };
    query.budgetMax = { $gte: minBudget };

    const requirements = await Requirement.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // -----------------------------
    // Fetch client (Seeker) details
    // -----------------------------
    const clientUserIds = [
      ...new Set(requirements.map((r: any) => r.clientId.toString())),
    ];

    const clients = await Seeker.find({
      userId: { $in: clientUserIds },
    })
      .select("userId location")
      .lean();

    const clientMap = new Map(
      clients.map((c: any) => [c.userId.toString(), c]),
    );
    const formattedRequirements = requirements.map((r: any) => ({
      ...r,

      // ✅ NEW (non-breaking addition)
      client: clientMap.get(r.clientId.toString()) || null,
    }));

    return NextResponse.json({
      success: true,
      requirements: formattedRequirements,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch requirements" },
      { status: 500 },
    );
  }
}

function formatPostedDate(date: Date) {
  const diff = (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 1) return "Today";
  if (diff < 2) return "1 day ago";
  return `${Math.floor(diff)} days ago`;
}
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const user = await getCurrentUser();

    //  Not logged in
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    //  Only client can post requirements
    if (user.role !== "client") {
      return NextResponse.json(
        { error: "Only clients can post requirements" },
        { status: 403 },
      );
    }

    const body = await req.json();
    console.log("body", body);
    const newReq = await Requirement.create({
      title: body.title,
      image: body.image,
      category: body.category,
      budgetMin: body.budgetMin,
      budgetMax: body.budgetMax,
      timeline: body.timeline,
      description: body.description,
      documentUrl: body.documentUrl,
      clientId: user.userId, // 👈 IMPORTANT: logged-in client
    });

    console.log("newReq", newReq);

    // Fetch only providers whose services match the category
    const providersMatchedServices = await Provider.find(
      {
        services: { $in: [newReq.category] }, //  array match
      },
      { userId: 1 },
    ).lean();

    // Create notifications
    if (providersMatchedServices.length > 0) {
      const notifications = providersMatchedServices.map((provider) => ({
        userId: provider.userId, //  RECEIVER (agency)
        triggeredBy: user.userId, //  Client who posted
        title: "New Requirement Posted",
        message: `A new requirement matching your services (${newReq.category}) has been posted.`,
        type: "NEW_REQUIREMENT",
        userRole: "agency",
        linkUrl: `/agency/dashboard/project-inquiries/${newReq._id}`,
        sourceId: newReq._id,
        isRead: false,
      }));

      await Notification.insertMany(notifications);
    }

    return NextResponse.json({
      success: true,
      requirement: {
        ...newReq.toObject(),
        createdAt: newReq.createdAt,
        updatedAt: newReq.updatedAt,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create requirement" },
      { status: 500 },
    );
  }
}
