import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const limit = Number.parseInt(searchParams.get("limit") || "50");
    const page = Number.parseInt(searchParams.get("page") || "1");

    const query: any = {};

    if (clientId) query.clientId = clientId;
    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate("clientId", "name email company")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(query),
    ]);

    const formattedProjects = projects.map((p: any) => ({
      id: p._id.toString(),
      clientId: p.clientId?._id?.toString() || p.clientId,
      clientName: p.clientId?.name || "Unknown",
      clientCompany: p.clientId?.company || "",
      title: p.title,
      description: p.description,
      category: p.category,
      subcategory: p.subcategory,
      budget: p.budget,
      budgetMin: p.budgetMin,
      budgetMax: p.budgetMax,
      timeline: p.timeline,
      skills: p.skills,
      requirements: p.requirements,
      status: p.status,
      proposalCount: p.proposalCount,
      viewCount: p.viewCount,
      matchedProviders: p.matchedProviders,
      isUrgent: p.isUrgent,
      isFeatured: p.isFeatured,
      deadline: p.deadline,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json({
      projects: formattedProjects,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
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

    if (user.role !== "client") {
      return NextResponse.json(
        { error: "Only clients can create projects" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const {
      title,
      description,
      category,
      subcategory,
      budget,
      budgetMin,
      budgetMax,
      timeline,
      skills,
      requirements,
      isUrgent,
      deadline,
    } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, category" },
        { status: 400 },
      );
    }

    const project = await Project.create({
      clientId: user.userId,
      title,
      description,
      category,
      subcategory,
      budget: budget || "Negotiable",
      budgetMin,
      budgetMax,
      timeline: timeline || "Flexible",
      skills: skills || [],
      requirements,
      status: "open",
      proposalCount: 0,
      viewCount: 0,
      matchedProviders: 0,
      shortlistedProviders: [],
      isUrgent: isUrgent || false,
      isFeatured: false,
      publishedAt: new Date(),
      deadline: deadline ? new Date(deadline) : undefined,
    });

    return NextResponse.json({
      success: true,
      project: {
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        category: project.category,
        budget: project.budget,
        timeline: project.timeline,
        status: project.status,
        createdAt: project.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
