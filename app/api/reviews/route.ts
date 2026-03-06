import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Review from "@/models/Review";
import Provider from "@/models/Provider";
import Project from "@/models/Project";
import { getCurrentUser } from "@/lib/auth/jwt";
import mongoose from "mongoose";
import Requirement from "@/models/Requirement";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const isAdmin = user.role === "admin";

    // 🔹 Build match condition dynamically
    const matchStage: any = {
      isPublic: true,
    };

    // 🔹 Only providers are restricted by providerId
    if (!isAdmin) {
      const id = user.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid provider ID" },
          { status: 400 },
        );
      }

      matchStage.providerId = new mongoose.Types.ObjectId(id);
    }

    const reviews = await Review.aggregate([
      {
        $match: matchStage,
      },

      // 🔹 Join Seeker (client details)
      {
        $lookup: {
          from: "seekers",
          localField: "clientId",
          foreignField: "userId",
          as: "client",
        },
      },
      {
        $unwind: {
          path: "$client",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 🔹 Join Requirement (project details)
      {
        $lookup: {
          from: "requirements",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: {
          path: "$project",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 🔹 Final response shape (UNCHANGED)
      {
        $project: {
          rating: 1,
          qualityRating: 1,
          scheduleRating: 1,
          costRating: 1,
          willingToReferRating: 1,
          title: 1,
          content: 1,
          pros: 1,
          cons: 1,
          keyHighLights: 1,
          createdAt: 1,
          response: { $ifNull: ["$response", {}] },

          client: {
            name: "$client.name",
            companyName: "$client.companyName",
            industry: "$client.industry",
            location: "$client.location",
            companySize: "$client.companySize",
            isVerified: "$client.isVerified",
            position: "$client.position",
          },

          project: {
            title: "$project.title",
            category: "$project.category",
            description: "$project.description",
            budgetMin: "$project.budgetMin",
            budgetMax: "$project.budgetMax",
          },
        },
      },

      {
        $sort: { createdAt: -1 },
      },
    ]);

    return NextResponse.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching provider reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
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
        { error: "Only clients can submit reviews" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const {
      providerId,
      projectId,
      rating,
      qualityRating,
      scheduleRating,
      costRating,
      willingToReferRating,
      content,
      pros,
      cons,
    } = body;

    if (!providerId || !projectId || !rating  || !content) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: providerId, projectId, rating, title, content",
        },
        { status: 400 },
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(providerId) ||
      !mongoose.Types.ObjectId.isValid(projectId)
    ) {
      return NextResponse.json(
        { error: "Invalid provider or project ID" },
        { status: 400 },
      );
    }

    // Verify project belongs to user
    const project = await Requirement.findById(projectId);
    if (!project || project.clientId.toString() !== user.userId) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 },
      );
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      clientId: user.userId,
      providerId,
      projectId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this provider for this project" },
        { status: 409 },
      );
    }

    // Create review
    const review = await Review.create({
      providerId,
      clientId: user.userId,
      projectId,
      rating,
      qualityRating: qualityRating || rating,
      scheduleRating: scheduleRating || rating,
      costRating: costRating || rating,
      willingToReferRating: willingToReferRating || rating,
      content,
      pros: pros || [],
      cons: cons || [],
      keyHighLights: body.keyHighLights || [],
      isVerified: false,
      isPublic: true,
    });

    // Mark project as reviewed
    await Requirement.findByIdAndUpdate(projectId, { isReviewed: true });

    // Update provider rating
    const reviews = await Review.find({ providerId, isPublic: true });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const avgCostRating =
      reviews.reduce((sum, r) => sum + r.costRating, 0) / reviews.length;
    const avgQualityRating =
      reviews.reduce((sum, r) => sum + r.qualityRating, 0) / reviews.length;
    const avgScheduleRating =
      reviews.reduce((sum, r) => sum + r.scheduleRating, 0) / reviews.length;
    const avgWillingToReferRating =
      reviews.reduce((sum, r) => sum + r.willingToReferRating, 0) /
      reviews.length;

    const providerToupdate = await Provider.findOneAndUpdate(
      { userId: providerId },
      {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        costRating: Math.round(avgCostRating * 10) / 10,
        qualityRating: Math.round(avgQualityRating * 10) / 10,
        scheduleRating: Math.round(avgScheduleRating * 10) / 10,
        willingToReferRating: Math.round(avgWillingToReferRating * 10) / 10,
      },
      { new: true },
    );
    console.log("--Updated provider ratings:", providerToupdate);
    //     console.log({
    //   avgRating,
    //   avgCostRating,
    //   avgQualityRating,
    //   avgScheduleRating,
    //   avgWillingToReferRating,
    // })

    return NextResponse.json({
      success: true,
      review: {
        id: review._id.toString(),
        rating: review.rating,
        title: review.title,
        content: review.content,
        createdAt: review.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}
