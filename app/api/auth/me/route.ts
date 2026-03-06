import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import Provider from "@/models/Provider"
import { getCurrentUser } from "@/lib/auth/jwt"

export async function GET() {
  try {
    const payload = await getCurrentUser()

    if (!payload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    await connectToDatabase()

    // Get full user data from MongoDB
    const user = await User.findById(payload.userId).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get provider profile if agency
    let provider = null
    if (user.role === "agency") {
      provider = await Provider.findOne({ userId: user._id })
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
      provider: provider
        ? {
            id: provider._id.toString(),
            name: provider.name,
            tagline: provider.tagline,
            description: provider.description,
            logo: provider.logo,
            location: provider.location,
            services: provider.services,
            rating: provider.rating,
            reviewCount: provider.reviewCount,
            isVerified: provider.isVerified,
            isFeatured: provider.isFeatured,
          }
        : null,
    })
  } catch (error) {
    console.error("Get current user error:", error)
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 })
  }
}
