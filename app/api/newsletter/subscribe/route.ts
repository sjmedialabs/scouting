import { NextRequest, NextResponse } from "next/server"
import SubscriberEmails from "@/models/SubscriberEmails"
import { connectToDatabase } from "@/lib/mongodb"
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json()
    const { email } = body

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      )
    }

    await SubscriberEmails.create({ email })

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
    })
  } catch (error: any) {
    // Duplicate email
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 409 }
      )
    }

    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    )
  }
}
// ✅ GET: Fetch all subscriber emails
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const subscribers = await SubscriberEmails.find()
      .select("email createdAt -_id")
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    })
  } catch (error) {
    console.error("Fetch subscribers error:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    )
  }
}