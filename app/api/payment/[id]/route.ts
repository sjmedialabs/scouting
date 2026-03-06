import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import Payment from "@/models/Payment"
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const userId = params.id

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid user id" },
        { status: 400 }
      )
    }

    const payments = await Payment.find({ userId })
      
      .sort({ createdAt: -1 })

    return NextResponse.json(
      {
        success: true,
        payments,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Get Payments Error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
