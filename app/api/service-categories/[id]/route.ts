import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ServiceCategory from "@/models/ServiceCategory";

export async function PUT(request: Request, { params }: any) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { id } = params;

    // Whitelist fields allowed to update
    const allowedFields = ["title", "slug", "icon", "children", "parent", "isMainCategory"];
    const updateData: Record<string, any> = {};

    for (const key in body) {
      if (allowedFields.includes(key)) {
        updateData[key] = body[key];
      }
    }

    const updated = await ServiceCategory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("PUT Category Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // 1. Find category first
    const category = await ServiceCategory.findById(params.id);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // 2. Prevent delete if subcategories exist
    if (category.children?.length > 0) {
      return NextResponse.json(
        { success: false, message: "Category has subcategories" },
        { status: 400 }
      );
    }

    // 3. Delete only after validation
    await ServiceCategory.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}

