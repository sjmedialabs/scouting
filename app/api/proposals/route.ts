import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";

import Proposal from "@/models/Proposal";
import Provider from "@/models/Provider";
import Seeker from "@/models/Seeker";
import Requirement from "@/models/Requirement";
import Notification from "@/models/Notification";
import User from "@/models/User"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(user.userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    await connectToDatabase();

    const userObjectId = new mongoose.Types.ObjectId(user.userId);

    const { searchParams } = new URL(request.url);
    const requirementId = searchParams.get("requirementId");
    const status = searchParams.get("status");
    const limit = Number(searchParams.get("limit") || 50);
    const page = Number(searchParams.get("page") || 1);
    const skip = (page - 1) * limit;

    const query: any = {};

    // 🔐 Role-based filtering
    if (user.role === "agency") {
      query.agencyId = userObjectId;
    }

    if (user.role === "client") {
      query.clientId = userObjectId;
    }

    if (requirementId && mongoose.Types.ObjectId.isValid(requirementId)) {
      query.requirementId = new mongoose.Types.ObjectId(requirementId);
    }

    if (status) query.status = status;

    const [proposals, total] = await Promise.all([
      Proposal.find(query)
        .populate("requirementId", "title category budgetMin budgetMax")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Proposal.countDocuments(query),
    ]);

    // 🔹 Fetch agencies
    const agencyUserIds = [
      ...new Set(proposals.map((p) => p.agencyId?.toString())),
    ];

    const agencies = await Provider.find({
      userId: { $in: agencyUserIds },
    })
      .select(
        "userId name logo location rating reviewCount services technologies coverImage",
      )
      .lean();

    const agencyMap = new Map(agencies.map((a) => [a.userId.toString(), a]));

    // 🔹 Fetch clients
    const clientUserIds = [
      ...new Set(proposals.map((p) => p.clientId?.toString())),
    ];

    const clients = await Seeker.find({
      userId: { $in: clientUserIds },
    })
      .select("userId name companyName")
      .lean();

    const clientMap = new Map(clients.map((c) => [c.userId.toString(), c]));

    const formattedProposals = proposals.map((p: any) => ({
      id: p._id.toString(),
      requirement: {
        id: p.requirementId?._id?.toString(),
        title: p.requirementId?.title,
        category: p.requirementId?.category,
        budgetMin: p.requirementId?.budgetMin,
        budgetMax: p.requirementId?.budgetMax,
      },
      agency: agencyMap.get(p.agencyId?.toString()) || null,
      client: clientMap.get(p.clientId?.toString()) || null,
      coverLetter: p.coverLetter,
      proposedBudget: p.proposedBudget,
      proposedTimeline: p.proposedTimeline,
      milestones: p.milestones,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      clientViewed:p.clientViewed,
      clientResponded:p.clientResponded,
      clientId:p.clientId,
      agencyId:p.agencyId,
      proposalDescription:p.proposalDescription
    }));

    return NextResponse.json({
      proposals: formattedProposals,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposals" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (user.role !== "agency") {
      return NextResponse.json(
        { error: "Only agencies can submit proposals" },
        { status: 403 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(user.userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    await connectToDatabase();

    const userObjectId = new mongoose.Types.ObjectId(user.userId);

    const body = await request.json();
    const {
      requirementId,
      proposalDescription,
      clientId,
      proposedBudget,
      proposedTimeline,
      coverLetter,
      milestones,
    } = body;

    if (!mongoose.Types.ObjectId.isValid(requirementId)) {
      return NextResponse.json(
        { error: "Invalid requirement ID" },
        { status: 400 },
      );
    }

    const provider = await Provider.findOne({ userId: user.userId });
    if (!provider) {
      return NextResponse.json(
        { error: "Provider profile not found" },
        { status: 404 },
      );
    }

    const project = await Requirement.findById(requirementId);
    if (!project || project.status.toLowerCase() === "closed") {
      return NextResponse.json(
        { error: "Project not accepting proposals" },
        { status: 400 },
      );
    }

    const existing = await Proposal.findOne({
      requirementId,
      agencyId: userObjectId,
    });

    if (existing) {
      return NextResponse.json(
        { error: "Proposal already submitted" },
        { status: 409 },
      );
    }

    const proposal = await Proposal.create({
      requirementId,
      clientId,
      agencyId: userObjectId,
      coverLetter,
      proposedBudget,
      proposalDescription,
      proposedTimeline: proposedTimeline || "As discussed",
      milestones: milestones || [],
      status: "pending",
    });

     // Update project proposal count
      await Requirement.findByIdAndUpdate(requirementId, { $inc: { proposals: 1 } })

      //update users proposal count
      await User.findByIdAndUpdate(user.userId,{$inc:{proposalCount:1}})

    await Notification.create({
      userId: clientId,
      triggeredBy: user.userId,
      title: "New Proposal Received!",
      message: `${provider.name} submitted a proposal`,
      type: "proposal_submitted",
      userRole: "client",
      sourceId: proposal._id,
      linkUrl:"/client/dashboard/proposals"
    });

    return NextResponse.json({ success: true, proposal });
  } catch (error) {
    console.error("Error creating proposal:", error);
    return NextResponse.json(
      { error: "Failed to create proposal" },
      { status: 500 },
    );
  }
}
