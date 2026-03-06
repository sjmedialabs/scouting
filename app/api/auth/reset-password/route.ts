import { NextResponse } from "next/server"
import crypto from "crypto"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { hashPassword } from "@/lib/auth/jwt"

export async function POST(req: Request) {
  try {
    await connectToDatabase()

    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      )
    }

    // ✅ IMPORTANT: use SAME hashing method as login/register
    user.password = await hashPassword(password)

    // Clear reset token fields
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    return NextResponse.json({
      message: "Password reset successful",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
