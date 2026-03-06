import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import MenuItems from "@/models/MenuItems";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    //  Auth check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }
    if (user.role != "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 },
      );
    }
    await connectToDatabase();

    const body = await req.json();
    const { title, slug, isActive = true } = body;

    // Validation
    if (!title || !slug) {
      return NextResponse.json(
        { success: false, message: "Title and slug are required" },
        { status: 400 },
      );
    }

    // Check duplicate slug
    const existingMenu = await MenuItems.findOne({ slug });
    if (existingMenu) {
      return NextResponse.json(
        { success: false, message: "Menu with this slug already exists" },
        { status: 409 },
      );
    }

    // ✅ Auto-assign order (append to end)
    const lastMenu = await MenuItems.findOne().sort({ order: -1 });
    const nextOrder = lastMenu ? lastMenu.order + 1 : 1;

    // ✅ Create menu
    const menu = await MenuItems.create({
      title,
      slug,
      order: nextOrder,
      isActive,
      parents: [],
    });

    return NextResponse.json({ success: true, data: menu }, { status: 201 });
  } catch (error) {
    console.error("Menu POST error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Fetch only active menu items
    const menuItems = await MenuItems.find({ isActive: true })
      .sort({ order: 1 }) // Sort main menus
      .lean();

    return NextResponse.json(
      { success: true, data: menuItems },
      { status: 200 },
    );
  } catch (error) {
    console.error("Menu GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
