// app/api/menu/[menuId]/parent/[parentId]/route.ts

// this is a put to update the parent elements title and isActive
import { NextRequest, NextResponse } from "next/server";
import MenuItems from "@/models/MenuItems";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";

//Json body example:

// {
//     "title":"parent title",
//     "isActive":true
// }
export async function PUT(
  req: NextRequest,
  { params }: { params: { menuId: string; parentId: string } },
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    await connectToDatabase();
    const { title, isActive } = await req.json();

    const menu = await MenuItems.findOneAndUpdate(
      { _id: params.menuId, "parents._id": params.parentId },
      {
        $set: {
          "parents.$.title": title,
          "parents.$.isActive": isActive,
        },
      },
      { new: true },
    );

    return NextResponse.json({ success: true, data: menu });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
