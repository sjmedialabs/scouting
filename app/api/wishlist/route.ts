import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";
import Wishlist from "@/models/Wishlist";

export async function POST(req: NextRequest) {
  try {
    //Authentication
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

    // Validation
    if (!agencyId) {
      return NextResponse.json(
        { success: false, message: "agencyId is required" },
        { status: 400 },
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(clientId) ||
      !mongoose.Types.ObjectId.isValid(agencyId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid ObjectId" },
        { status: 400 },
      );
    }

    // Prevent duplicate wishlist entry
    const alreadyExists = await Wishlist.findOne({
      clientId,
      agencyId,
    });

    if (alreadyExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Agency already added to wishlist",
        },
        { status: 409 },
      );
    }

    // Create wishlist entry
    const wishlist = await Wishlist.create({
      clientId,
      agencyId,
    });

    // ✅ Populate agency details
    const populatedWishlist = await Wishlist.aggregate([
      {
        $match: { _id: wishlist._id },
      },
      {
        $lookup: {
          from: "providers",
          localField: "agencyId",
          foreignField: "_id",
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
          agency: {
            _id: "$agency._id",
            name: "$agency.name",
            logo: "$agency.logo",
            rating: "$agency.rating",
            reviewCount: "$agency.reviewCount",
            location: "$agency.location",
          },
        },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Added to wishlist successfully",
        data: populatedWishlist[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Wishlist POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
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

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return NextResponse.json(
        { success: false, message: "Invalid client ID" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // ✅ Fetch wishlist with FULL provider data
    const wishlist = await Wishlist.aggregate([
      {
        $match: {
          clientId: new mongoose.Types.ObjectId(clientId),
        },
      },
      {
        $lookup: {
          from: "providers",
          localField: "agencyId",
          foreignField: "_id",
          as: "agency",
        },
      },
      {
        $unwind: "$agency",
      },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          agency: {
            // 🔹 BASIC INFO
            _id: "$agency._id",
            userId: "$agency.userId",
            name: "$agency.name",
            tagline: "$agency.tagline",
            description: "$agency.description",
            logo: "$agency.logo",
            coverImage: "$agency.coverImage",
            location: "$agency.location",
            website: "$agency.website",
            email: "$agency.email",
            salesEmail: "$agency.salesEmail",
            phone: "$agency.phone",
            adminContactPhone: "$agency.adminContactPhone",

            // 🔹 ARRAYS
            services: "$agency.services",
            technologies: "$agency.technologies",
            industries: "$agency.industries",
            portfolio: "$agency.portfolio",
            testimonials: "$agency.testimonials",
            certifications: "$agency.certifications",
            awards: "$agency.awards",
            keyHighlights: {
              $ifNull: ["$agency.keyHighlights", []],
            },

            // 🔹 RATINGS
            rating: "$agency.rating",
            qualityRating: "$agency.qualityRating",
            scheduleRating: "$agency.scheduleRating",
            costRating: "$agency.costRating",
            willingToReferRating: "$agency.willingToReferRating",
            reviewCount: "$agency.reviewCount",

            // 🔹 BUSINESS INFO
            projectsCompleted: "$agency.projectsCompleted",
            hourlyRate: "$agency.hourlyRate",
            minProjectSize: "$agency.minProjectSize",
            teamSize: "$agency.teamSize",
            foundedYear: "$agency.foundedYear",

            // 🔹 SOCIAL LINKS
            socialLinks: "$agency.socialLinks",

            // 🔹 FLAGS
            isFeatured: "$agency.isFeatured",
            isVerified: "$agency.isVerified",
            isActive: "$agency.isActive",

            // 🔹 ANALYTICS
            profileViews: "$agency.profileViews",
            impressions: "$agency.impressions",
            websiteClicks: "$agency.websiteClicks",

            // 🔹 PRICING / TIMELINE
            minAmount: {
              $ifNull: ["$agency.minAmount", 0],
            },
            minTimeLine: {
              $ifNull: ["$agency.minTimeLine", "N/A"],
            },

            // 🔹 TIMESTAMPS
            createdAt: "$agency.createdAt",
            updatedAt: "$agency.updatedAt",
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        count: wishlist.length,
        data: wishlist,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Wishlist GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
