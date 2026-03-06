import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Subscription from "@/models/Subscription"

/* =========================================================
   GET SINGLE SUBSCRIPTION BY ID
========================================================= */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const { id } = params

    const subscription = await Subscription.findById(id).lean()

    if (!subscription) {
      return NextResponse.json(
        { success: false, message: "Subscription not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: subscription._id.toString(),
        title: subscription.title,
        pricePerMonth: subscription.pricePerMonth,
        pricePerYear: subscription.pricePerYear,
        yearlySubscription: subscription.yearlySubscription,
        description: subscription.description,
        features: subscription.features,
        isActive: subscription.isActive,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
      },
    })
  } catch (error) {
    console.error("Get Subscription Error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch subscription" },
      { status: 500 }
    )
  }
}

/* =========================================================
   UPDATE SUBSCRIPTION (EDIT / STATUS CHANGE)
========================================================= */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const { id } = params
    const body = await request.json()

    const subscription = await Subscription.findById(id)

    if (!subscription) {
      return NextResponse.json(
        { success: false, message: "Subscription not found" },
        { status: 404 }
      )
    }

    // Update only provided fields
    if (body.title !== undefined) subscription.title = body.title
    if (body.pricePerMonth !== undefined)
      subscription.pricePerMonth = body.pricePerMonth
    if (body.pricePerYear !== undefined)
      subscription.pricePerYear = body.pricePerYear
    if (body.yearlySubscription !== undefined)
      subscription.yearlySubscription = body.yearlySubscription
    if (body.description !== undefined)
      subscription.description = body.description
    if (body.features !== undefined)
      subscription.features = body.features
    if (body.isActive !== undefined)
      subscription.isActive = body.isActive

    await subscription.save()

    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
      data: {
        id: subscription._id.toString(),
        title: subscription.title,
        pricePerMonth: subscription.pricePerMonth,
        pricePerYear: subscription.pricePerYear,
        yearlySubscription: subscription.yearlySubscription,
        description: subscription.description,
        features: subscription.features,
        isActive: subscription.isActive,
        updatedAt: subscription.updatedAt,
      },
    })
  } catch (error: any) {
    console.error("Update Subscription Error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update subscription" },
      { status: 500 }
    )
  }
}
