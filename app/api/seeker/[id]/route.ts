import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Seeker from "@/models/Seeker";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();

    const { id } = params;

    // Try finding by Mongo _id
    let seeker = null;

    if (id && id.length === 24) {
      seeker = await Seeker.findById(id).lean();
    }

    // If not found, try finding by userId
    if (!seeker) {
      seeker = await Seeker.findOne({ userId: id }).lean();
    }

    // If still not found → return 404
    if (!seeker) {
      return NextResponse.json(
        { success: false, message: "Seeker not found" },
        { status: 404 },
      );
    }

    // Format response
    const formattedSeeker = {
      id: seeker._id.toString(),
      userId: seeker.userId?.toString(),
      name: seeker.name,
      email: seeker.email,
      phoneNumber: seeker.phoneNumber,
      companyName: seeker.companyName,
      position: seeker.position,
      industry: seeker.industry,
      location: seeker.location,
      website: seeker.website,
      bio: seeker.bio,
      timeZone: seeker.timeZone,
      preferredCommunication: seeker.preferredCommunication,
      typicalProjectBudget: seeker.typicalProjectBudget,
      companySize: seeker.companySize,
      isActive: seeker.isActive,
      isVerified: seeker.isVerified,
      image: seeker.image,
      createdAt: seeker.createdAt,
      updatedAt: seeker.updatedAt,
    };

    return NextResponse.json(
      { success: true, data: formattedSeeker },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Seeker GET Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
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
    console.log("---UserId to update the data::", id);
    const updates = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 },
      );
    }

    // Find and update based on userId
    const updatedSeeker = await Seeker.findOneAndUpdate(
      { userId: id }, // filter
      { $set: updates }, // values to update
      { new: true }, // return updated document
    ).lean();

    if (!updatedSeeker) {
      return NextResponse.json(
        { success: false, message: "Seeker not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: updatedSeeker },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Seeker UPDATE Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
