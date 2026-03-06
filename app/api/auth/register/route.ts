import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import Provider from "@/models/Provider"
import Seeker from "@/models/Seeker"
import { generateToken, setAuthCookie, hashPassword } from "@/lib/auth/jwt"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { email, password, name, role, companyName } = body

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Missing required fields: email, password, name, role" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Validate role
    if (!["client", "agency", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user in MongoDB
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
      company: companyName,
      isVerified: false,
      isActive: true,
    })

    // Create provider profile for agencies
    if (role === "agency") {
      await Provider.create({
        userId: user._id,
        name: companyName || name,
        email: email.toLowerCase(),
        description: "New agency profile",
        location: "Not specified",
        services: [],
        technologies: [],
        industries: [],
        rating: 0,
        reviewCount: 0,
        projectsCompleted: 0,
        portfolio: [],
        testimonials: [],
        certifications: [],
        awards: [],
        isFeatured: false,
        isVerified: false,
        isActive: true,
        socialLinks: {
          linkedin:"",
          twitter:"",
          facebook:"",
          instagram:"",
        },
        profileViews: 0,
        impressions: 0,
        websiteClicks: 0,
      })
    }
    
    //Create Seeker Profile details for the client dashboatrd
    if(role==="client"){
      console.log("---client condition ok:::",user._id)
      await Seeker.create({
        userId:user._id,
        name:user.name,
    email:user.email,
    phoneNumber: undefined,
    companyName: user.company || "",
    position: "",
    industry: "Technology",
    location: "",
    website: "",
    bio: "",
    timeZone:"Asia/Kolkata",
    preferredCommunication: "email", // FIXED TYPO
    typicalProjectBudget: "$1,000 - $5,000", // FIXED TYPO
    companySize: "1-10",
    
    image: "",
      })
    }


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
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    }

    return NextResponse.json({
      success: true,
      user: userResponse,
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
