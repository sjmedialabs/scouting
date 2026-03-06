import Razorpay from "razorpay"
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Payment from "@/models/Payment"
import { getCurrentUser } from "@/lib/auth/jwt"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  await connectToDatabase()

  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { planId, amount } = await req.json()

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  })

  // Save payment entry
  await Payment.create({
    userId: user.userId,
    planId,
    razorpayOrderId: order.id,
    amount,
    status: "created",
  })

  return NextResponse.json(order)
}
