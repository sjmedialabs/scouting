import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import FreeTrialConfig from "@/models/FreeTrailConfig";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { proposalLimit } = await request.json();

    if (proposalLimit === undefined || proposalLimit < 0) {
      return NextResponse.json(
        { error: "Invalid proposal limit" },
        { status: 400 }
      );
    }

    const existing = await FreeTrialConfig.findOne();
    if (existing) {
      return NextResponse.json(
        { error: "Free trial config already exists" },
        { status: 409 }
      );
    }

    const config = await FreeTrialConfig.create({ proposalLimit });

    return NextResponse.json(
      {
        success: true,
        message: "Free trial proposal limit created",
        proposalLimit: config.proposalLimit,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST FreeTrialConfig error:", error);
    return NextResponse.json(
      { error: "Failed to create free trial config" },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    await connectToDatabase();

    const config = await FreeTrialConfig.findOne();

    if (!config) {
      return NextResponse.json(
        { error: "Free trial config not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      proposalLimit: config.proposalLimit,
    });
  } catch (error) {
    console.error("GET FreeTrialConfig error:", error);
    return NextResponse.json(
      { error: "Failed to fetch free trial config" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { proposalLimit } = await request.json();

    if (proposalLimit === undefined || proposalLimit < 0) {
      return NextResponse.json(
        { error: "Invalid proposal limit" },
        { status: 400 }
      );
    }

    const updatedConfig = await FreeTrialConfig.findOneAndUpdate(
      {},
      { proposalLimit },
      { new: true }
    );

    if (!updatedConfig) {
      return NextResponse.json(
        { error: "Free trial config not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Free trial proposal limit updated",
      proposalLimit: updatedConfig.proposalLimit,
    });
  } catch (error) {
    console.error("PUT FreeTrialConfig error:", error);
    return NextResponse.json(
      { error: "Failed to update free trial config" },
      { status: 500 }
    );
  }
}
