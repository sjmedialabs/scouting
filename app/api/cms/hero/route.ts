import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CMSContent from "@/models/CMSContent";
import { getCurrentUser } from "@/lib/auth/jwt";

// Default hero content
const defaultHeroContent = {
  title: "Find the Perfect Partner for Any Project",
  subtitle: "Connect with top-rated agencies and service providers worldwide",
  description:
    "Spark connects businesses with vetted agencies and freelancers. Post your project, receive proposals, and hire the best talent for your needs.",
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
};

export async function GET() {
  try {
    await connectToDatabase();

    const heroContent = await CMSContent.findOne({
      key: "hero",
      type: "hero",
    }).lean();

    if (!heroContent) {
      // Return default content if not found in DB
      return NextResponse.json({ content: defaultHeroContent });
    }

    return NextResponse.json({
      content: {
        title: (heroContent as any).title || defaultHeroContent.title,
        subtitle: (heroContent as any).subtitle || defaultHeroContent.subtitle,
        description:
          (heroContent as any).description || defaultHeroContent.description,
        ctaPrimary:
          (heroContent as any).content?.ctaPrimary ||
          defaultHeroContent.ctaPrimary,
        ctaSecondary:
          (heroContent as any).content?.ctaSecondary ||
          defaultHeroContent.ctaSecondary,
        stats: (heroContent as any).content?.stats || defaultHeroContent.stats,
        popularSearches:
          (heroContent as any).content?.popularSearches ||
          defaultHeroContent.popularSearches,
      },
    });
  } catch (error) {
    console.error("Error fetching hero content:", error);
    return NextResponse.json({ content: defaultHeroContent });
  }
}

export async function PUT(request: NextRequest) {
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

    const updated = await CMSContent.findOneAndUpdate(
      { key: "hero", type: "hero" },
      {
        key: "hero",
        type: "hero",
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        content: {
          ctaPrimary: body.ctaPrimary,
          ctaSecondary: body.ctaSecondary,
          stats: body.stats,
          popularSearches: body.popularSearches,
        },
        isActive: true,
      },
      { upsert: true, new: true },
    );

    return NextResponse.json({
      success: true,
      content: {
        title: updated.title,
        subtitle: updated.subtitle,
        description: updated.description,
        ctaPrimary: updated.content?.ctaPrimary,
        ctaSecondary: updated.content?.ctaSecondary,
        stats: updated.content?.stats,
        popularSearches: updated.content?.popularSearches,
      },
    });
  } catch (error) {
    console.error("Error updating hero content:", error);
    return NextResponse.json(
      { error: "Failed to update hero content" },
      { status: 500 },
    );
  }
}
