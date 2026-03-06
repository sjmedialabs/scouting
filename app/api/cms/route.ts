import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CMSContent from "@/models/CMSContent";
import { getCurrentUser } from "@/lib/auth/jwt";

// --------- GET CMS (Fetch the only document) ----------
export async function GET() {
  try {
    await connectToDatabase();

    let cms = await CMSContent.findOne().lean();

    // Auto-create CMS if empty
    if (!cms) {
      cms = await CMSContent.create({});
    }

    return NextResponse.json({ success: true, data: cms });
  } catch (error) {
    console.error("CMS GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch CMS" },
      { status: 500 },
    );
  }
}
// --------- POST CMS (Create Initial CMS Only Once) ----------
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    // CMS should only be created once
    const exists = await CMSContent.findOne();
    if (exists) {
      return NextResponse.json(
        { success: false, error: "CMS already exists. Use PUT to update." },
        { status: 400 },
      );
    }

    const body = await req.json();

    const cms = await CMSContent.create(body);

    return NextResponse.json({
      success: true,
      message: "CMS initialized successfully",
      data: cms,
    });
  } catch (error) {
    console.error("CMS POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize CMS" },
      { status: 500 },
    );
  }
}

// --------- UPDATE CMS (Admin only) ----------
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const body = await req.json();

    // Find existing CMS doc
    const updated = await CMSContent.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("CMS PUT Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update CMS" },
      { status: 500 },
    );
  }
}
