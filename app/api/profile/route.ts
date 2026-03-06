import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // TODO: Get user ID from authentication
    // TODO: Fetch profile from database

    const profile = {
      id: "1",
      name: "Spark Development",
      email: "contact@sparkdev.com",
      website: "https://sparkdev.com",
      salesEmail: "sales@sparkdev.com",
      schedulingLink: "",
      adminContactPhone: "",
      foundingYear: 2022,
      totalEmployees: "10-49",
      tagline: "We value your Needs",
      companyVideoLink: "",
      languagesSpoken: ["English", "Spanish"],
      description: "We provide impressive tailor-made digital services...",
      subscriptionTier: "standard",
      verified: true,
      featured: false,
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "email"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate website URL if provided
    if (body.website && !body.website.startsWith("http")) {
      return NextResponse.json(
        { error: "Website must be a valid URL starting with http:// or https://" },
        { status: 400 },
      )
    }

    // Validate tagline length
    if (body.tagline && body.tagline.length > 50) {
      return NextResponse.json({ error: "Tagline must be 50 characters or less" }, { status: 400 })
    }

    // TODO: Update profile in database
    const updatedProfile = {
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
