import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";

import ReportedContent from "@/models/ReportedContent";
import Notification from "@/models/Notification";

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(user.userId)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { reason, description, reportedTo } = body;

    //Validations
    if (!reason || !description || !reportedTo) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(reportedTo)) {
      return NextResponse.json(
        { error: "Invalid reportedTo user ID" },
        { status: 400 }
      );
    }

    // Prevent self-reporting
    if (reportedTo === user.userId) {
      return NextResponse.json(
        { error: "You cannot report yourself" },
        { status: 400 }
      );
    }

    // Create report
    const report = await ReportedContent.create({
      reason,
      description,
      reportedBy: user.userId,
      reportedTo: reportedTo,
      status: "pending",
    });

    //  Optional: notify admin/moderator
    // await Notification.create({
    //   title: "New Content Reported",
    //   message: `A user has reported content for reason: ${reason}`,
    //   type: "content_reported",
    //   sourceId: report._id,
    //   userRole: "admin",
    //   triggeredBy: user.userId,
    // });

    return NextResponse.json(
      { success: true, report },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error reporting content:", error);
    return NextResponse.json(
      { error: "Failed to report content" },
      { status: 500 }
    );
  }
}
export async function GET(request: NextRequest) {
  try {
    //  Auth check
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Restrict to admin (recommended)
    // if (user.role !== "admin") {
    //   return NextResponse.json(
    //     { error: "Access denied" },
    //     { status: 403 }
    //   );
    // }

    await connectToDatabase();

    // Pagination (optional but scalable)
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);
    const skip = (page - 1) * limit;

    //  Fetch reports
    const [reports, total] = await Promise.all([
      ReportedContent.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("reportedBy", "name email role")
        .populate("reportedTo", "name email role")
        .lean(),
      ReportedContent.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      reports,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reported content:", error);
    return NextResponse.json(
      { error: "Failed to fetch reported content" },
      { status: 500 }
    );
  }
}