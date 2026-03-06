import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Provider from "@/models/Provider";
import Review from "@/models/Review";
import { getCurrentUser } from "@/lib/auth/jwt";
import mongoose from "mongoose";
import dayjs from "dayjs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // ---------------------------------------------
    // 🔥 NEW LOGIC: Find provider by _id OR userId
    // ---------------------------------------------
    const provider = await Provider.findOne({
      $or: [
        { _id: id }, // match provider's _id
        { userId: id }, // match provider's userId
      ],
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 },
      );
    }

    // Increment profile views
    // await Provider.updateOne(
    //   { _id: provider._id },
    //   { $inc: { profileViews: 1 } }
    // )

    // const monthKey = dayjs().format("YYYY-MM");
    // // Reset if month changed
    // if (provider.currentMonthKey !== monthKey) {
    //   provider.currentMonthKey = monthKey;
    //   provider.currentMonthProfileViews = 0;
    //   provider.currentMonthWebsiteClicks = 0;
    // }

    // // Example: profile view
    // provider.profileViews += 1;
    // provider.currentMonthProfileViews += 1;

    await provider.save();

    const reviews = await Review.find({
      providerId: provider._id.toString(),
      isPublic: true,
    });

    const formattedReviews = reviews.map((r: any) => ({
      id: r._id.toString(),
      clientName: r.clientId?.name || "Anonymous",
      clientCompany: r.clientId?.company || "",
      rating: r.rating,
      qualityRating: r.qualityRating,
      scheduleRating: r.scheduleRating,
      costRating: r.costRating,
      willingToReferRating: r.willingToReferRating,
      title: r.title,
      content: r.content,
      pros: r.pros,
      cons: r.cons,
      isVerified: r.isVerified,
      response: r.response,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({
      provider: {
        id: provider._id.toString(),
        userId: provider.userId?.toString(),
        name: provider.name,
        tagline: provider.tagline,
        description: provider.description,
        logo: provider.logo,
        coverImage: provider.coverImage,
        location: provider.location,
        website: provider.website,
        email: provider.email,
        salesEmail: provider.salesEmail,
        phone: provider.phone,
        adminContactPhone: provider.adminContactPhone,
        services: provider.services,
        technologies: provider.technologies,
        industries: provider.industries,
        rating: provider.rating,
        reviewCount: provider.reviewCount,
        projectsCompleted: provider.projectsCompleted,
        hourlyRate: provider.hourlyRate,
        minProjectSize: provider.minProjectSize,
        websiteClicks: provider.websiteClicks,
        teamSize: provider.teamSize,
        foundedYear: provider.foundedYear,
        portfolio: provider.portfolio,
        testimonials: provider.testimonials,
        certifications: provider.certifications,
        awards: provider.awards,
        socialLinks: provider.socialLinks,
        isFeatured: provider.isFeatured,
        isVerified: provider.isVerified,
        profileViews: provider.profileViews || 0,
        currentMonthProfileViews: provider.currentMonthProfileViews,
        lastMonthProfileViews: provider.lastMonthProfileViews,
        currentMonthWebsiteClicks: provider.currentMonthWebsiteClicks,
        focusArea: provider.focusArea,
        createdAt: provider.createdAt,
      },
      reviews: formattedReviews,
    });
  } catch (error) {
    console.error("Error fetching provider:", error);
    return NextResponse.json(
      { error: "Failed to fetch provider" },
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
        { error: "Invalid provider ID" },
        { status: 400 },
      );
    }

    // ---------------------------------------------
    // 🔥 NEW LOGIC: Find provider by _id OR userId
    // ---------------------------------------------
    const provider = await Provider.findOne({
      $or: [
        { _id: id }, // match provider's _id
        { userId: id }, // match provider's userId
      ],
    }).lean();

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 },
      );
    }

    // if (provider.userId.toString() !== user.userId && user.role !== "admin") {
    //   return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    // }

    const body = await request.json();
    const allowedUpdates = [
      "name",
      "tagline",
      "description",
      "logo",
      "coverImage",
      "location",
      "website",
      "email",
      "salesEmail",
      "projectsCompleted",
      "lastMonthProfileViews",
      "phone",
      "adminContactPhone",
      "services",
      "technologies",
      "industries",
      "hourlyRate",
      "minProjectSize",
      "focusArea",
      "teamSize",
      "foundedYear",
      "portfolio",
      "testimonials",
      "certifications",
      "websiteClicks",
      "profileViews",
      "currentMonthProfileViews",
      "currentMonthWebsiteClicks",
      "currentMonthKey",
      "awards",
      "socialLinks",
      "isVerified",
    ];

    const updates: any = {};

    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    // Admin-only updates
    if (user.role === "admin") {
      if (body.isFeatured !== undefined) updates.isFeatured = body.isFeatured;
      if (body.isVerified !== undefined) updates.isVerified = body.isVerified;
      if (body.isActive !== undefined) updates.isActive = body.isActive;
    }

    // const updated = await Provider.findOneAndUpdate({ userId: id }, updates, { new: true })

    // Apply updates using resolved _id
    console.log("Updating provider with ID:", updates);
    const updated = await Provider.findByIdAndUpdate(
      provider._id,
      { $set: updates }, // ✅ FORCE FIELD CREATION
      {
        new: true,
        runValidators: true, // ✅ ensure schema validation
      },
    );

    return NextResponse.json({
      success: true,
      provider: {
        id: updated!._id.toString(),
        name: updated!.name,
        tagline: updated!.tagline,
        description: updated!.description,
        services: updated!.services,
        rating: updated!.rating,
        isFeatured: updated!.isFeatured,
        isVerified: updated!.isVerified,
        updatedAt: updated!.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating provider:", error);
    return NextResponse.json(
      { error: "Failed to update provider" },
      { status: 500 },
    );
  }
}
