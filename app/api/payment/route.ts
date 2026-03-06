// app/api/payments/route.ts
import { NextResponse } from "next/server"
import Payment from "@/models/Payment"
import User from "@/models/User"
import Subscription from "@/models/Subscription"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    await connectToDatabase()

    const payments = await Payment.find()
      
     
      .sort({ createdAt: -1 })

    return NextResponse.json(
      {
        success: true,
        count: payments.length,
        data: payments,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("GET payments error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch payments" },
      { status: 500 }
    )
  }
}
