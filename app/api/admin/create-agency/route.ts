import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Provider from "@/models/Provider";
import crypto from "crypto";
import { getCurrentUser } from "@/lib/auth/jwt";
import { sendSetPasswordEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();

    const { company, email } = await req.json();

    // prevent duplicate users
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // generate password setup token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      email: email.toLowerCase(),
      name: company,
      role: "agency",
      company,
      password: "TEMP_PASSWORD", 
      isVerified: false,
      isActive: true,
      resetPasswordToken: resetToken,
      resetPasswordExpires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 Days
    });

    // create Provider profile (same as register)
    await Provider.create({
      userId: user._id,
      name: company,
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
        linkedin: "",
        twitter: "",
        facebook: "",
        instagram: "",
      },
      profileViews: 0,
      impressions: 0,
      websiteClicks: 0,
    });

    // send email
    await sendSetPasswordEmail(email, resetToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin create agency error:", error);
    return NextResponse.json(
      { error: "Failed to create agency" },
      { status: 500 }
    );
  }
}
