import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Proposal from "@/models/Proposal";
import { getCurrentUser } from "@/lib/auth/jwt";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 },
      );
    }

    const project = await Project.findById(id)
      .populate("clientId", "name email company")
      .lean();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Increment view count
    await Project.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    return NextResponse.json({
      project: {
        id: (project as any)._id.toString(),
        clientId:
          (project as any).clientId?._id?.toString() ||
          (project as any).clientId,
        clientName: (project as any).clientId?.name || "Unknown",
        clientCompany: (project as any).clientId?.company || "",
        title: (project as any).title,
        description: (project as any).description,
        category: (project as any).category,
        subcategory: (project as any).subcategory,
        budget: (project as any).budget,
        budgetMin: (project as any).budgetMin,
        budgetMax: (project as any).budgetMax,
        timeline: (project as any).timeline,
        skills: (project as any).skills,
        requirements: (project as any).requirements,
        status: (project as any).status,
        proposalCount: (project as any).proposalCount,
        viewCount: (project as any).viewCount + 1,
        matchedProviders: (project as any).matchedProviders,
        isUrgent: (project as any).isUrgent,
        isFeatured: (project as any).isFeatured,
        deadline: (project as any).deadline,
        createdAt: (project as any).createdAt,
        updatedAt: (project as any).updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 },
      );
    }

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.clientId.toString() !== user.userId && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const allowedUpdates = [
      "title",
      "description",
      "category",
      "subcategory",
      "budget",
      "budgetMin",
      "budgetMax",
      "timeline",
      "skills",
      "requirements",
      "status",
      "isUrgent",
      "deadline",
    ];
    const updates: any = {};

    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    const updated = await Project.findByIdAndUpdate(id, updates, { new: true });

    return NextResponse.json({
      success: true,
      project: {
        id: updated!._id.toString(),
        title: updated!.title,
        description: updated!.description,
        category: updated!.category,
        budget: updated!.budget,
        timeline: updated!.timeline,
        status: updated!.status,
        updatedAt: updated!.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 },
      );
    }

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.clientId.toString() !== user.userId && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Delete associated proposals
    await Proposal.deleteMany({ projectId: id });

    // Delete project
    await Project.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
