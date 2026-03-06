import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Comparision from "@/models/Comparision";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 🔐 Auth check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const { id } = params;

    // ✅ Validate clientId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid clientId" },
        { status: 400 },
      );
    }

    const clientObjectId = new mongoose.Types.ObjectId(id);

    // ✅ Aggregation pipeline
    const comparisons = await Comparision.aggregate([
      {
        $match: {
          clientId: clientObjectId,
        },
      },

      // 🔗 Join Provider (agency) using Provider._id
      {
        $lookup: {
          from: "providers",
          localField: "agencyId",
          foreignField: "_id",
          as: "agency",
        },
      },
      {
        $unwind: {
          path: "$agency",
          preserveNullAndEmptyArrays: false,
        },
      },

      // 🎯 Final response
      {
        $project: {
          _id: 1,
          clientId: 1,
          createdAt: 1,
          isFavourite: 1,
          agency: {
            _id: "$agency._id",
            name: "$agency.name",
            logo: "$agency.logo",
            rating: "$agency.rating",
            reviewCount: "$agency.reviewCount",
            costRating: "$agency.costRating",
            qualityRating: "$agency.qualityRating",
            scheduleRating: "$agency.scheduleRating",
            willingToReferRating: "$agency.willingToReferRating",
            location: "$agency.location",
            minAmount: {
              $ifNull: ["$agency.minAmount", 0],
            },
            minTimeLine: {
              $ifNull: ["$agency.minTimeLine", "N/A"],
            },
            keyHighlights: {
              $ifNull: ["$agency.keyHighlights", []],
            },
          },
        },
      },
      {
        $sort: { createdAt: -1 }, // optional
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: comparisons,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET Comparison Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
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

    const { id } = params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid comparison id" },
        { status: 400 },
      );
    }

    // ✅ Delete document
    const deletedComparison = await Comparision.findByIdAndDelete(id);

    if (!deletedComparison) {
      return NextResponse.json(
        { success: false, message: "Comparison not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comparison deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE Comparison Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    //  Auth check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const clientId = user.userId;
    const { id } = params;

    //  Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid comparison ID" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { isFavourite } = body;

    // Validate body
    if (typeof isFavourite !== "boolean") {
      return NextResponse.json(
        { success: false, message: "isFavourite must be boolean" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Update with ownership check
    const updatedComparison = await Comparision.findOneAndUpdate(
      { _id: id, clientId },
      { isFavourite },
      { new: true },
    );

    if (!updatedComparison) {
      return NextResponse.json(
        {
          success: false,
          message: "Comparison not found or unauthorized",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Favourite status updated",
        data: updatedComparison,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Comparison PUT Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
