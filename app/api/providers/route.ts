// import { type NextRequest, NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/mongodb"
// import Provider from "@/models/Provider"

// export async function GET(request: NextRequest) {
//   try {
//     await connectToDatabase()

//     const { searchParams } = new URL(request.url)
//     const location = searchParams.get("location")
//     const service = searchParams.get("service")
//     const minRating = searchParams.get("minRating")
//     const featured = searchParams.get("featured")
//     const limit = Number.parseInt(searchParams.get("limit") || "50")
//     const page = Number.parseInt(searchParams.get("page") || "1")

//     const query: any = { isActive: true }

//     if (location) {
//       query.location = { $regex: location, $options: "i" }
//     }
//     if (service) {
//       query.services = { $in: [new RegExp(service, "i")] }
//     }
//     if (minRating) {
//       query.rating = { $gte: Number.parseFloat(minRating) }
//     }
//     if (featured === "true") {
//       query.isFeatured = true
//     }

//     const skip = (page - 1) * limit

//     const [providers, total] = await Promise.all([
//       Provider.find(query).sort({ isFeatured: -1, rating: -1 }).skip(skip).limit(limit).lean(),
//       Provider.countDocuments(query),
//     ])

//     const formattedProviders = providers.map((p: any) => ({
//       id: p._id.toString(),
//       userId: p.userId?.toString(),
//       name: p.name,
//       tagline: p.tagline,
//       description: p.description,
//       logo: p.logo,
//       coverImage: p.coverImage,
//       location: p.location,
//       website: p.website,
//       email: p.email,
//       salesEmail: p.salesEmail,
//       phone: p.phone,
//       adminContactPhone: p.adminContactPhone,
//       services: p.services,
//       technologies: p.technologies,
//       industries: p.industries,
//       rating: p.rating,
//       reviewCount: p.reviewCount,
//       costRating: p.costRating,
//       qualityRating: p.qualityRating,
//       scheduleRating: p.scheduleRating,
//       willingToReferRating: p.willingToReferRating,
//       projectsCompleted: p.projectsCompleted,
//       hourlyRate: p.hourlyRate,
//       minProjectSize: p.minProjectSize,
//       teamSize: p.teamSize,
//       foundedYear: p.foundedYear,
//       portfolio: p.portfolio,
//       testimonials: p.testimonials,
//       certifications: p.certifications,
//       awards: p.awards,
//       socialLinks: p.socialLinks,
//       isFeatured: p.isFeatured,
//       isVerified: p.isVerified,
//       createdAt: p.createdAt,
//     }))

//     return NextResponse.json({
//       providers: formattedProviders,
//       pagination: {
//         total,
//         page,
//         limit,
//         pages: Math.ceil(total / limit),
//       },
//     })
//   } catch (error) {
//     console.error("Error fetching providers:", error)
//     return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 })
//   }
// }
// export async function POST(req: Request) {
//   try {
//     await connectToDatabase()

//     const body = await req.json()

//     // Create a new provider
//     const provider = await Provider.create(body)

//     return NextResponse.json(
//       { success: true, data: provider },
//       { status: 201 }
//     )

//   } catch (error: any) {
//     console.error("Provider POST Error:", error)

//     return NextResponse.json(
//       { success: false, message: error.message || "Server Error" },
//       { status: 500 }
//     )
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Provider from "@/models/Provider";
import User from "@/models/User"

/* -----------------------------
   CORS CONFIG
------------------------------ */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // 🔒 change to your domain in prod if needed
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/* -----------------------------
   OPTIONS (Preflight)
------------------------------ */
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/* -----------------------------
   GET Providers
------------------------------ */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const location = searchParams.get("location");
    const service = searchParams.get("service");
    const minRating = searchParams.get("minRating");
    const featured = searchParams.get("featured");
    const limit = Number.parseInt(searchParams.get("limit") || "50");
    const page = Number.parseInt(searchParams.get("page") || "1");

    const query: any = { isActive: true };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (service) {
      query.services = { $in: [new RegExp(service, "i")] };
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    const skip = (page - 1) * limit;

    const [providers, total] = await Promise.all([
      Provider.find(query)
        .sort({ isFeatured: -1, rating: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Provider.countDocuments(query),
    ]);

    const userIds = providers
      .map((p: any) => p.userId)
      .filter(Boolean);

      const users = await User.find(
      { _id: { $in: userIds } },
      {
        subscriptionPlanId: 1,
        subscriptionStartDate: 1,
        subscriptionEndDate: 1,
      }
    ).lean();

    const userSubscriptionMap = new Map(
  users.map((u: any) => [
    u._id.toString(),
    {
      subscriptionPlanId: u.subscriptionPlanId,
      subscriptionStartDate: u.subscriptionStartDate,
      subscriptionEndDate: u.subscriptionEndDate,
    },
  ])
);



    const formattedProviders = providers.map((p: any) => ({
      id: p._id.toString(),
      userId: p.userId?.toString(),
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      logo: p.logo,
      coverImage: p.coverImage,
      location: p.location,
      website: p.website,
      email: p.email,
      salesEmail: p.salesEmail,
      phone: p.phone,
      adminContactPhone: p.adminContactPhone,
      services: p.services,
      technologies: p.technologies,
      industries: p.industries,
      rating: p.rating,
      reviewCount: p.reviewCount,
      costRating: p.costRating,
      qualityRating: p.qualityRating,
      scheduleRating: p.scheduleRating,
      willingToReferRating: p.willingToReferRating,
      projectsCompleted: p.projectsCompleted,
      hourlyRate: p.hourlyRate,
      minProjectSize: p.minProjectSize,
      teamSize: p.teamSize,
      foundedYear: p.foundedYear,
      portfolio: p.portfolio,
      testimonials: p.testimonials,
      certifications: p.certifications,
      awards: p.awards,
      socialLinks: p.socialLinks,
      isFeatured: p.isFeatured,
      isVerified: p.isVerified,
      createdAt: p.createdAt,

      // ✅ NEW (non-breaking)
  subscriptionDetails:
    p.userId && userSubscriptionMap.get(p.userId.toString())
      ? userSubscriptionMap.get(p.userId.toString())
      : null,
    }));

    return NextResponse.json(
      {
        providers: formattedProviders,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500, headers: corsHeaders },
    );
  }
}

/* -----------------------------
   POST Provider
------------------------------ */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const provider = await Provider.create(body);

    return NextResponse.json(
      { success: true, data: provider },
      { status: 201, headers: corsHeaders },
    );
  } catch (error: any) {
    console.error("Provider POST Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500, headers: corsHeaders },
    );
  }
}
