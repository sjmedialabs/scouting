import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import ContactProvider from "@/models/ContactProvider";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    //  Authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const body = await req.json();
    const { agencyId, name, email, message, interstedService } = body;

    //  Basic validation
    if (!agencyId || !name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(agencyId)) {
      return NextResponse.json({ error: "Invalid agencyId" }, { status: 400 });
    }

    // Create contact provider entry
    const contactProvider = await ContactProvider.create({
      clientId: user.userId, // seeker user id
      agencyId,
      name,
      email,
      message,
      interstedService,
    });

    return NextResponse.json(
      {
        message: "Contact provider request submitted successfully",
        data: contactProvider,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("ContactProvider POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    // Logged-in agency's userId
    const agencyId = user.userId;

    if (!mongoose.Types.ObjectId.isValid(agencyId)) {
      return NextResponse.json({ error: "Invalid agency ID" }, { status: 400 });
    }

    // Fetch contact requests
    const contactRequests = await ContactProvider.find({
      agencyId: agencyId,
    })

      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Contact provider requests fetched successfully",
        count: contactRequests.length,
        data: contactRequests,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("ContactProvider GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
