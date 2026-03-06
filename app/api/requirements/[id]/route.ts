import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Requirement from "@/models/Requirement"
import { getCurrentUser } from "@/lib/auth/jwt"   // <-- IMPORTANT
import { error } from "console"
import mongoose from "mongoose"

// GET Requirements


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase()

    const { id } = await params

    console.log("---client Id:::",id);

    // ✅ Validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid client ID" },
        { status: 400 }
      )
    }

    const objectId = new mongoose.Types.ObjectId(id)

    const search = req.nextUrl.searchParams.get("search") || ""
    const category = req.nextUrl.searchParams.get("category") || ""
    const minBudget = Number(req.nextUrl.searchParams.get("minBudget") || 0)
    const maxBudget = Number(req.nextUrl.searchParams.get("maxBudget") || 9999999)

      // Try to find a requirement by _id first
      const requirementById = await Requirement.findById(objectId).lean()

      let query: any = {}

      if (requirementById) {
        // ✅ Case 1: id is requirement _id
        query._id = objectId
      } else {
        // ✅ Case 2: id is clientId (existing behavior)
        query.clientId = objectId
      }

    if (search) {
      query.title = { $regex: search, $options: "i" }
    }

    if (category && category !== "all") {
      query.category = category
    }

    query.budgetMin = { $lte: maxBudget }
    query.budgetMax = { $gte: minBudget }

    const requirements = await Requirement.find(query)
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      requirements,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch requirements" },
      { status: 500 }
    )
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const { id } = params
    console.log("Updating requirement _id:", id)

    // ✅ Validate MongoDB _id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid requirement ID" },
        { status: 400 }
      )
    }

    const body = await req.json()

    // ✅ Allowed update fields
    const updateData = {
      title: body.title,
      description: body.description,
      category: body.category,
      budgetMin: body.budgetMin,
      budgetMax: body.budgetMax,
      timeline: body.timeline,
      documentUrl: body.documentUrl,
      status: body.status,
      image: body.image,
      notApprovedMsg:body.notApprovedMsg
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    )

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      )
    }

    const updatedRequirement = await Requirement.findByIdAndUpdate(
      id,                // 🔥 MongoDB _id from params
      updateData,
      { new: true, runValidators: true }
    ).lean()

    if (!updatedRequirement) {
      return NextResponse.json(
        { success: false, error: "Requirement not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      requirement: updatedRequirement,
    })
  } catch (error) {
    console.error("PUT requirement error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update requirement" },
      { status: 500 }
    )
  }
}
