import { NextResponse } from "next/server";
import {connectToDatabase} from "@/lib/mongodb";
import ServiceCategory from "@/models/ServiceCategory";

export async function GET() {
  try {
    await connectToDatabase();

    const categories = await ServiceCategory.find().lean();

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error("GET Category Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const newCategory = await ServiceCategory.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: newCategory
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Category Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}
