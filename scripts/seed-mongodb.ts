// MongoDB Seed Script
// Run this to populate initial data in MongoDB

import mongoose from "mongoose"

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://scout:scout123@scout.xjvlmhs.mongodb.net/spark?appName=scout"

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Import models
    const User = (await import("../models/User")).default
    const Provider = (await import("../models/Provider")).default
    const Project = (await import("../models/Project")).default
    const CMSContent = (await import("../models/CMSContent")).default

    // Hash password function
    const hashPassword = async (password: string): Promise<string> => {
      const encoder = new TextEncoder()
      const data = encoder.encode(password + "spark-salt")
      const hashBuffer = await crypto.subtle.digest("SHA-256", data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    }

    // Clear existing data
    await User.deleteMany({})
    await Provider.deleteMany({})
    await Project.deleteMany({})
    await CMSContent.deleteMany({})
    console.log("Cleared existing data")

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
    console.log("Created admin user: admin@spark.com / admin123")

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
    console.log("Created client user: client@spark.com / client123")

    // Create agency users and providers
    const agencies = [
      {
        user: {
          email: "agency1@spark.com",
          name: "TechVision Labs",
          company: "TechVision Labs Inc",
        },
        provider: {
          name: "TechVision Labs",
          tagline: "Transforming Ideas into Digital Reality",
          description:
            "A full-service digital agency specializing in web development, mobile apps, and cloud solutions. We help startups and enterprises build scalable digital products.",
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
        },
      },
      {
        user: {
          email: "agency2@spark.com",
          name: "Creative Minds Studio",
          company: "Creative Minds Studio LLC",
        },
        provider: {
          name: "Creative Minds Studio",
          tagline: "Where Creativity Meets Strategy",
          description:
            "Award-winning design agency focused on brand identity, UI/UX design, and digital marketing. We create memorable experiences that drive results.",
          location: "New York, NY",
          services: ["Brand Identity", "UI/UX Design", "Digital Marketing", "Video Production"],
          technologies: ["Figma", "Adobe Creative Suite", "Webflow", "After Effects"],
          industries: ["Media", "Fashion", "Entertainment", "Retail"],
          rating: 4.9,
          reviewCount: 89,
          projectsCompleted: 180,
          hourlyRate: "$125-175",
          minProjectSize: "$15,000",
          teamSize: "25-50",
          foundedYear: 2018,
          isFeatured: true,
          isVerified: true,
        },
      },
      {
        user: {
          email: "agency3@spark.com",
          name: "DataDriven Solutions",
          company: "DataDriven Solutions Corp",
        },
        provider: {
          name: "DataDriven Solutions",
          tagline: "Intelligence That Drives Growth",
          description:
            "Data analytics and AI consulting firm helping businesses leverage data for strategic decisions. Experts in machine learning, BI, and predictive analytics.",
          location: "Austin, TX",
          services: ["Data Analytics", "AI/ML Development", "Business Intelligence", "Data Engineering"],
          technologies: ["Python", "TensorFlow", "Tableau", "Snowflake", "Apache Spark"],
          industries: ["Finance", "Healthcare", "Logistics", "Manufacturing"],
          rating: 4.7,
          reviewCount: 65,
          projectsCompleted: 120,
          hourlyRate: "$175-250",
          minProjectSize: "$50,000",
          teamSize: "25-50",
          foundedYear: 2019,
          isFeatured: false,
          isVerified: true,
        },
      },
    ]

    const agencyPassword = await hashPassword("agency123")

    for (const agency of agencies) {
      const user = await User.create({
        email: agency.user.email,
        password: agencyPassword,
        name: agency.user.name,
        role: "agency",
        company: agency.user.company,
        isVerified: true,
        isActive: true,
      })

      await Provider.create({
        ...agency.provider,
        userId: user._id,
        email: agency.user.email,
        portfolio: [
          {
            title: "E-commerce Platform Redesign",
            description: "Complete redesign and development of a major e-commerce platform",
            image: "/ecommerce-concept.png",
            technologies: ["React", "Node.js", "PostgreSQL"],
            completedDate: "2024-06",
          },
          {
            title: "Healthcare Mobile App",
            description: "Patient engagement mobile application with telehealth features",
            image: "/healthcare-app-interface.png",
            technologies: ["React Native", "Firebase", "HIPAA Compliant"],
            completedDate: "2024-03",
          },
        ],
        testimonials: [
          {
            clientName: "Sarah Johnson",
            company: "TechStart Inc",
            rating: 5,
            text: "Exceptional team that delivered beyond our expectations. Highly recommended!",
            date: "2024-05",
          },
        ],
        isActive: true,
      })

      console.log(`Created agency: ${agency.user.email} / agency123`)
    }

    // Create sample projects
    const projects = [
      {
        title: "E-commerce Website Development",
        description:
          "Looking for an experienced team to build a modern e-commerce platform with custom product configurator, inventory management, and payment integration.",
        category: "Development",
        subcategory: "E-commerce",
        budget: "$25,000 - $50,000",
        budgetMin: 25000,
        budgetMax: 50000,
        timeline: "3-4 months",
        skills: ["React", "Node.js", "Stripe", "PostgreSQL"],
        status: "open",
      },
      {
        title: "Brand Identity Design",
        description:
          "Seeking a creative agency to develop complete brand identity including logo, color palette, typography, and brand guidelines for a fintech startup.",
        category: "Design",
        subcategory: "Brand Identity",
        budget: "$10,000 - $20,000",
        budgetMin: 10000,
        budgetMax: 20000,
        timeline: "6-8 weeks",
        skills: ["Brand Design", "Logo Design", "Visual Identity"],
        status: "open",
      },
      {
        title: "Mobile App Development",
        description:
          "Need a cross-platform mobile app for fitness tracking with social features, workout plans, and integration with wearables.",
        category: "Development",
        subcategory: "Mobile Apps",
        budget: "$50,000 - $100,000",
        budgetMin: 50000,
        budgetMax: 100000,
        timeline: "4-6 months",
        skills: ["React Native", "Firebase", "HealthKit", "Google Fit"],
        status: "open",
      },
    ]

    for (const project of projects) {
      await Project.create({
        ...project,
        clientId: client._id,
        proposalCount: 0,
        viewCount: Math.floor(Math.random() * 100),
        matchedProviders: Math.floor(Math.random() * 20),
        isUrgent: false,
        isFeatured: false,
        publishedAt: new Date(),
      })
    }
    console.log(`Created ${projects.length} sample projects`)

    // Create CMS content
    await CMSContent.create({
      key: "hero",
      type: "hero",
      title: "Find the Perfect Partner for Any Project",
      subtitle: "Connect with top-rated agencies and service providers worldwide",
      description:
        "Spark connects businesses with vetted agencies and freelancers. Post your project, receive proposals, and hire the best talent for your needs.",
      content: {
        ctaPrimary: { text: "Post a Project", link: "/post-project" },
        ctaSecondary: { text: "Browse Providers", link: "/providers" },
        stats: [
          { label: "Active Providers", value: "10,000+" },
          { label: "Projects Completed", value: "50,000+" },
          { label: "Client Satisfaction", value: "98%" },
        ],
        popularSearches: [
          "Web Development",
          "Mobile App",
          "UI/UX Design",
          "Digital Marketing",
          "SEO Services",
          "E-commerce",
        ],
      },
      isActive: true,
    })

    const categories = [
      {
        key: "development",
        title: "Development",
        icon: "Code",
        description: "Web, mobile, and software development services",
        content: {
          subcategories: ["Web Development", "Mobile Apps", "Custom Software", "E-commerce", "API Development"],
          providerCount: 2500,
        },
      },
      {
        key: "design",
        title: "Design",
        icon: "Palette",
        description: "Creative design and branding services",
        content: {
          subcategories: ["UI/UX Design", "Graphic Design", "Brand Identity", "Motion Graphics", "Illustration"],
          providerCount: 1800,
        },
      },
      {
        key: "marketing",
        title: "Marketing",
        icon: "TrendingUp",
        description: "Digital marketing and growth services",
        content: {
          subcategories: ["SEO", "PPC Advertising", "Social Media", "Content Marketing", "Email Marketing"],
          providerCount: 2200,
        },
      },
      {
        key: "it-services",
        title: "IT Services",
        icon: "Server",
        description: "Infrastructure and technical support",
        content: {
          subcategories: ["Cloud Services", "Cybersecurity", "DevOps", "IT Consulting", "Network Management"],
          providerCount: 1500,
        },
      },
      {
        key: "business",
        title: "Business Services",
        icon: "Briefcase",
        description: "Business consulting and strategy",
        content: {
          subcategories: ["Strategy Consulting", "Financial Services", "Legal Services", "HR Services", "Operations"],
          providerCount: 1200,
        },
      },
    ]

    for (let i = 0; i < categories.length; i++) {
      await CMSContent.create({
        ...categories[i],
        type: "category",
        order: i,
        isActive: true,
      })
    }
    console.log("Created CMS content")

    console.log("\n✓ Database seeded successfully!")
    console.log("\nTest Accounts:")
    console.log("  Admin:  admin@spark.com / admin123")
    console.log("  Client: client@spark.com / client123")
    console.log("  Agency: agency1@spark.com / agency123")
    console.log("  Agency: agency2@spark.com / agency123")
    console.log("  Agency: agency3@spark.com / agency123")

    await mongoose.disconnect()
  } catch (error) {
    console.error("Seed error:", error)
    process.exit(1)
  }
}

seedDatabase()
