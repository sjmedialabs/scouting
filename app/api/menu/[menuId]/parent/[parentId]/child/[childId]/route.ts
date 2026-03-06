// app/api/menu/[menuId]/parent/[parentId]/child/[childId]/route.ts

// this is a put to update the child elements title, slug, url, isActive and order

import { NextRequest, NextResponse } from "next/server";
import MenuItems from "@/models/MenuItems";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";

//Json body example:

// {
//   "title": "Pricing",
//   "slug": "pricing",
//   "url": "/pricing",
//   "isActive": false
// }

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      menuId: string;
      parentId: string;
      childId: string;
    };
  },
) {
  try {
    // 🔐 Auth check
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const { title, slug, url, isActive, order } = await req.json();

    // 🛠 Build dynamic update object
    const updateFields: Record<string, any> = {};

    if (title !== undefined)
      updateFields["parents.$[p].children.$[c].title"] = title;

    if (slug !== undefined)
      updateFields["parents.$[p].children.$[c].slug"] = slug;

    if (url !== undefined) updateFields["parents.$[p].children.$[c].url"] = url;

    if (isActive !== undefined)
      updateFields["parents.$[p].children.$[c].isActive"] = isActive;

    if (order !== undefined)
      updateFields["parents.$[p].children.$[c].order"] = order;

    // ❌ Nothing to update
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    const updatedMenu = await MenuItems.findOneAndUpdate(
      { _id: params.menuId },
      { $set: updateFields },
      {
        arrayFilters: [
          { "p._id": params.parentId },
          { "c._id": params.childId },
        ],
        new: true,
      },
    );

    if (!updatedMenu) {
      return NextResponse.json(
        { success: false, message: "Menu / Parent / Child not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Child updated successfully",
      data: updatedMenu,
    });
  } catch (error) {
    console.error("Update child error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
