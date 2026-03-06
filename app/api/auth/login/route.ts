import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { generateToken, setAuthCookie, verifyPassword } from "@/lib/auth/jwt"



export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { email, password, role } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields: email, password" }, { status: 400 })
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({ error: "Account is deactivated" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("PASSWORD CHECK:", {
      plain: password,
      hashed: user.password,
      result: isValidPassword,
    })

    // Check role if provided
    if (role && user.role !== role) {
    console.warn("Role mismatch:", {
      selectedRole: role,
      actualRole: user.role,
    })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = await generateToken(user)

    // Set auth cookie
    await setAuthCookie(token)

    // Return user data (without password)
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company,
      isActive:user.isActive,
      isVerified: user.isVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    }

    return NextResponse.json({
      success: true,
      user: userResponse,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
