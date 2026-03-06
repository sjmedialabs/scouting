import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CMSContent from "@/models/CMSContent";
import { getCurrentUser } from "@/lib/auth/jwt";

// Default categories
const defaultCategories = [
  {
    id: "development",
    name: "Development",
    icon: "Code",
    description: "Web, mobile, and software development services",
    subcategories: [
      "Web Development",
      "Mobile Apps",
      "Custom Software",
      "E-commerce",
      "API Development",
    ],
    providerCount: 2500,
  },
  {
    id: "design",
    name: "Design",
    icon: "Palette",
    description: "Creative design and branding services",
    subcategories: [
      "UI/UX Design",
      "Graphic Design",
      "Brand Identity",
      "Motion Graphics",
      "Illustration",
    ],
    providerCount: 1800,
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: "TrendingUp",
    description: "Digital marketing and growth services",
    subcategories: [
      "SEO",
      "PPC Advertising",
      "Social Media",
      "Content Marketing",
      "Email Marketing",
    ],
    providerCount: 2200,
  },
  {
    id: "it-services",
    name: "IT Services",
    icon: "Server",
    description: "Infrastructure and technical support",
    subcategories: [
      "Cloud Services",
      "Cybersecurity",
      "DevOps",
      "IT Consulting",
      "Network Management",
    ],
    providerCount: 1500,
  },
  {
    id: "business",
    name: "Business Services",
    icon: "Briefcase",
    description: "Business consulting and strategy",
    subcategories: [
      "Strategy Consulting",
      "Financial Services",
      "Legal Services",
      "HR Services",
      "Operations",
    ],
    providerCount: 1200,
  },
];

export async function GET() {
  try {
    await connectToDatabase();

    const categories = await CMSContent.find({
      type: "category",
      isActive: true,
    })
      .sort({ order: 1 })
      .lean();

    if (!categories || categories.length === 0) {
      return NextResponse.json({ categories: defaultCategories });
    }

    const formattedCategories = categories.map((c: any) => ({
      id: c.key,
      name: c.title,
      icon: c.icon,
      description: c.description,
      subcategories: c.content?.subcategories || [],
      providerCount: c.content?.providerCount || 0,
      link: c.link,
    }));

    return NextResponse.json({ categories: formattedCategories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ categories: defaultCategories });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { id, name, icon, description, subcategories, providerCount, link } =
      body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "Missing required fields: id, name" },
        { status: 400 },
      );
    }

    const category = await CMSContent.create({
      key: id,
      type: "category",
      title: name,
      icon,
      description,
      link,
      content: {
        subcategories: subcategories || [],
        providerCount: providerCount || 0,
      },
      order: (await CMSContent.countDocuments({ type: "category" })) + 1,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      category: {
        id: category.key,
        name: category.title,
        icon: category.icon,
        description: category.description,
        subcategories: category.content?.subcategories,
        providerCount: category.content?.providerCount,
      },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
