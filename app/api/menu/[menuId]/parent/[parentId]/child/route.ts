// app/api/menu/[menuId]/parent/[parentId]/child/route.ts

// this is a post to add child elements to a parent menu item

//Json body example:

// {
//   "title": "Pricing",
//   "slug": "pricing",
//   "url": "/pricing",
//   "isActive": true
// }

import { NextRequest, NextResponse } from "next/server";
import MenuItems from "@/models/MenuItems";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function POST(
  req: NextRequest,
  { params }: { params: { menuId: string; parentId: string } },
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    await connectToDatabase();
    const { title, slug, url, isActive = true } = await req.json();

    const menu = await MenuItems.findById(params.menuId);
    if (!menu) return NextResponse.json({ success: false }, { status: 404 });

    const parent = menu.parents.id(params.parentId);
    if (!parent) {
      return NextResponse.json({ success: false, message: "Parent not found" });
    }

    const nextOrder = parent.children.length
      ? Math.max(...parent.children.map((c) => c.order)) + 1
      : 1;

    parent.children.push({
      title,
      slug,
      url,
      order: nextOrder,
      isActive,
    });

    await menu.save();
    return NextResponse.json({ success: true, data: menu });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
