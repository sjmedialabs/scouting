import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Comparision from "@/models/Comparision";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    // 🔐 Auth check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const clientId = user.userId;

    await connectToDatabase();

    const body = await req.json();
    const { agencyId } = body;

    // ✅ Required fields
    if (!agencyId) {
      return NextResponse.json(
        { success: false, message: "agencyId is required" },
        { status: 400 },
      );
    }

    // ✅ Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(clientId) ||
      !mongoose.Types.ObjectId.isValid(agencyId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid ObjectId provided" },
        { status: 400 },
      );
    }

    // ✅ Limit: Max 4 vendors per client
    const comparisonCount = await Comparision.countDocuments({ clientId });

    if (comparisonCount >= 4) {
      return NextResponse.json(
        {
          success: false,
          message: "You can compare only up to 4 vendors",
        },
        { status: 400 },
      );
    }

    // ✅ Prevent duplicate vendor for same client
    const alreadyExists = await Comparision.findOne({
      clientId,
      agencyId,
    });

    if (alreadyExists) {
      return NextResponse.json(
        {
          success: false,
          message: "This vendor is already added for comparison",
        },
        { status: 409 },
      );
    }

    // ✅ Create comparison
    const comparison = await Comparision.create({
      clientId,
      agencyId,
      isFavourite: false,
    });

    // ✅ Fetch populated response
    const comparisons = await Comparision.aggregate([
      {
        $match: {
          _id: comparison._id,
        },
      },
      {
        $lookup: {
          from: "providers",
          localField: "agencyId",
          foreignField: "_id", // 🔥 direct Provider reference
          as: "agency",
        },
      },
      {
        $unwind: "$agency",
      },
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
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Vendor added to comparison successfully",
        data: comparisons[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Comparison POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
