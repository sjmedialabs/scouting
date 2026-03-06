// app/api/menu/[menuId]/parent/route.ts

//this is an post to post the parent elements

//Json body example:

// {
//     "title":"parent title",
//     "slug":"parenttitle",
// }
import { NextRequest, NextResponse } from "next/server";
import MenuItems from "@/models/MenuItems";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function POST(
  req: NextRequest,
  { params }: { params: { menuId: string } },
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const { title, slug, isActive = true } = await req.json();

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, message: "Title and slug required" },
        { status: 400 },
      );
    }

    const menu = await MenuItems.findById(params.menuId);
    if (!menu) {
      return NextResponse.json(
        { success: false, message: "Menu not found" },
        { status: 404 },
      );
    }

    // Auto order
    const nextOrder = menu.parents.length
      ? Math.max(...menu.parents.map((p) => p.order)) + 1
      : 1;

    menu.parents.push({
      title,
      slug,
      order: nextOrder,
      isActive,
      children: [],
    });

    await menu.save();

    return NextResponse.json({ success: true, data: menu });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
