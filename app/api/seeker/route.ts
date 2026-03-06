import { NextResponse,NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Seeker from "@/models/Seeker"

export async function POST(req: Request) {
  try {
    await connectToDatabase()

    const body = await req.json()
    const { email, phoneNumber } = body

    // Validate required fields
    if (!email || !phoneNumber) {
      return NextResponse.json(
        { success: false, message: "Email and phone number are required" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await Seeker.findOne({ email })
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      )
    }

    // Check if phone number already exists
    const existingPhone = await Seeker.findOne({ phoneNumber })
    if (existingPhone) {
      return NextResponse.json(
        { success: false, message: "Phone number already exists" },
        { status: 409 }
      )
    }

    // Create a new seeker profile
    const seeker = await Seeker.create(body)

    return NextResponse.json(
      { success: true, data: seeker },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("Seeker POST Error:", error)

    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)

    const location = searchParams.get("location")
    const industry = searchParams.get("industry")
    const companySize = searchParams.get("companySize")
    const isVerified = searchParams.get("isVerified")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const page = Number.parseInt(searchParams.get("page") || "1")

    const query: any = {}

    // Filter: by location
    if (location) {
      query.location = { $regex: location, $options: "i" }
    }

    // Filter: industry
    if (industry) {
      query.industry = { $regex: industry, $options: "i" }
    }

    // Filter: company size
    if (companySize) {
      query.companySize = companySize
    }

    // Filter: verified
    if (isVerified === "true") {
      query.isVerified = true
    }

    const skip = (page - 1) * limit

    // Fetch seekers + count
    const [seekers, total] = await Promise.all([
      Seeker.find(query)
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limit)
        .lean(),
      Seeker.countDocuments(query),
    ])

    // Format response
    const formattedSeekers = seekers.map((s: any) => ({
      id: s._id.toString(),
      name: s.name,
      email: s.email,
      phoneNumber: s.phoneNumber,
      companyName: s.companyName,
      position: s.position,
      industry: s.industry,
      location: s.location,
      website: s.website,
      bio: s.bio,
      timeZone: s.timeZone,
      preferredCommunication: s.preferredCommunication,
      typicalProjectBudget: s.typicalProjectBudget,
      companySize: s.companySize,
      isActive: s.isActive,
      isVerified: s.isVerified,
      image: s.image,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }))

    return NextResponse.json({
      seekers: formattedSeekers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching seekers:", error)
    return NextResponse.json({ error: "Failed to fetch seekers" }, { status: 500 })
  }
}
