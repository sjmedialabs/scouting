import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import Provider from "@/models/Provider"
import Project from "@/models/Project"
import CMSContent from "@/models/CMSContent"

// Hash password function
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "spark-salt")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function POST() {
  try {
    await connectToDatabase()

    // Check if already seeded
    const existingUsers = await User.countDocuments()
    if (existingUsers > 0) {
      return NextResponse.json({
        message: "Database already seeded",
        users: existingUsers,
      })
    }

    // Create admin user
    const adminPassword = await hashPassword("admin123")
    const admin = await User.create({
      email: "admin@spark.com",
      password: adminPassword,
      name: "Admin User",
      role: "admin",
      isVerified: true,
      isActive: true,
    })

    // Create client user
    const clientPassword = await hashPassword("client123")
    const client = await User.create({
      email: "client@spark.com",
      password: clientPassword,
      name: "John Client",
      role: "client",
      company: "Acme Corp",
      isVerified: true,
      isActive: true,
    })

    // Create agency users and providers
    const agencyPassword = await hashPassword("agency123")

    const agencyUser = await User.create({
      email: "agency1@spark.com",
      password: agencyPassword,
      name: "TechVision Labs",
      role: "agency",
      company: "TechVision Labs Inc",
      isVerified: true,
      isActive: true,
    })

    await Provider.create({
      userId: agencyUser._id,
      name: "TechVision Labs",
      email: "agency1@spark.com",
      tagline: "Transforming Ideas into Digital Reality",
      description: "A full-service digital agency specializing in web development, mobile apps, and cloud solutions.",
      location: "San Francisco, CA",
      services: ["Web Development", "Mobile Apps", "Cloud Solutions", "UI/UX Design"],
      technologies: ["React", "Node.js", "AWS", "Python", "TypeScript"],
      industries: ["Technology", "Healthcare", "Finance", "E-commerce"],
      rating: 4.8,
      reviewCount: 127,
      projectsCompleted: 250,
      hourlyRate: "$150-200",
      minProjectSize: "$25,000",
      teamSize: "50-100",
      foundedYear: 2015,
      isFeatured: true,
      isVerified: true,
      isActive: true,
      portfolio: [
        {
          title: "E-commerce Platform",
          description: "Modern e-commerce platform with 1M+ users",
          image: "/ecommerce-concept.png",
          technologies: ["React", "Node.js"],
          completedDate: "2024-06",
        },
      ],
      testimonials: [
        {
          clientName: "Sarah Johnson",
          company: "TechStart Inc",
          rating: 5,
          text: "Exceptional team that delivered beyond expectations!",
          date: "2024-05",
        },
      ],
    })

    // Create sample project
    await Project.create({
      clientId: client._id,
      title: "E-commerce Website Development",
      description: "Looking for an experienced team to build a modern e-commerce platform.",
      category: "Development",
      budget: "$25,000 - $50,000",
      budgetMin: 25000,
      budgetMax: 50000,
      timeline: "3-4 months",
      skills: ["React", "Node.js", "Stripe"],
      status: "open",
      proposalCount: 0,
      viewCount: 45,
      publishedAt: new Date(),
    })

    // Create CMS content
    await CMSContent.create({
      key: "hero",
      type: "hero",
      title: "Find the Perfect Partner for Any Project",
      subtitle: "Connect with top-rated agencies and service providers worldwide",
      description: "Spark connects businesses with vetted agencies and freelancers.",
      content: {
        ctaPrimary: { text: "Post a Project", link: "/post-project" },
        ctaSecondary: { text: "Browse Providers", link: "/providers" },
        stats: [
          { label: "Active Providers", value: "10,000+" },
          { label: "Projects Completed", value: "50,000+" },
          { label: "Client Satisfaction", value: "98%" },
        ],
        popularSearches: ["Web Development", "Mobile App", "UI/UX Design", "Digital Marketing"],
      },
      isActive: true,
    })

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      accounts: {
        admin: "admin@spark.com / admin123",
        client: "client@spark.com / client123",
        agency: "agency1@spark.com / agency123",
      },
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
