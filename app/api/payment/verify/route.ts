import crypto from "crypto"
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Payment from "@/models/Payment"
import Subscription from "@/models/Subscription"
import User from "@/models/User"
import { getCurrentUser } from "@/lib/auth/jwt"

export async function POST(req: Request) {
  try {
    await connectToDatabase()

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false }, { status: 401 })
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      billingCycle, // Monthly | Yearly
    } = await req.json()

    // 1️⃣ Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    //  Get subscription plan
    const plan = await Subscription.findById(planId)
    if (!plan) {
      return NextResponse.json({ success: false }, { status: 404 })
    }

    //  Calculate dates based on billing cycle
    const startDate = new Date()
    const endDate = new Date(startDate)

    if (billingCycle === "Yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1)
    } else {
      // Monthly (default)
      endDate.setMonth(endDate.getMonth() + 1)
    }

    //  Update Payment record
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "success",
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
      }
    )

    //  Update User subscription details
    await User.findByIdAndUpdate(user.userId, {
      subscriptionPlanId: plan._id,
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
      billingCycle, // store Monthly / Yearly
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Payment verification failed" },
      { status: 500 }
    )
  }
}
