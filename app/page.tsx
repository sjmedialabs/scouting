"use client";
import React, { useState,useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { headers } from "next/headers";
import { HomeHero } from "@/app/home-hero";
import {
  Code,
  Palette,
  TrendingUp,
  Megaphone,
  Briefcase,
  Shield,
} from "lucide-react";
import { authFetch } from "@/lib/auth-fetch";

interface ServiceChild {
  _id: string;
  title: string;
  slug?: string;
}

export interface ServiceCategory {
  _id: string;
  title: string;
  slug?: string;
  icon: string | null;
  color: string;
  order: number;
  children: ServiceChild[];
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Palette,
  TrendingUp,
  Megaphone,
  Briefcase,
  Shield,
};

// Color mapping
const colorMap: Record<string, { bg: string; hover: string; text: string }> = {
  green: {
    bg: "from-green-100 to-green-200",
    hover: "hover:border-green-200",
    text: "text-green-600",
  },
  purple: {
    bg: "from-purple-100 to-purple-200",
    hover: "hover:border-purple-200",
    text: "text-purple-600",
  },
  blue: {
    bg: "from-blue-100 to-blue-200",
    hover: "hover:border-blue-200",
    text: "text-blue-600",
  },
  orange: {
    bg: "from-orange-100 to-orange-200",
    hover: "hover:border-orange-200",
    text: "text-orange-600",
  },
  teal: {
    bg: "from-teal-100 to-teal-200",
    hover: "hover:border-teal-200",
    text: "text-teal-600",
  },
  indigo: {
    bg: "from-indigo-100 to-indigo-200",
    hover: "hover:border-indigo-200",
    text: "text-indigo-600",
  },
};



export default async function HomePage() {
const [data, setData] = useState({
  cms: null,
  providers: [],
  projects: [],
  categories: [],
});

const [resLoading, setResLoading] = useState(false);

async function getData() {
  let baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  const REVALIDATE_TIME = Number(process.env.CMS_REVALIDATE_TIME) || 10;
  const options = { next: { revalidate: REVALIDATE_TIME } };

  try {
    setResLoading(true);

    const [cmsRes, providersRes, projectsRes, categoriesRes] =
      await Promise.all([
        fetch(`/api/cms`, options),
        fetch(`/api/providers`, options),
        fetch(`/api/requirements`, options),
        fetch(`/api/service-categories`, options),
      ]);

    const cms = cmsRes.ok ? (await cmsRes.json()).data : null;

    const providers = providersRes.ok
      ? (await providersRes.json()).providers?.slice(0, 3)
      : [];

    const projectsData = projectsRes.ok ? await projectsRes.json() : {};
    const projects = (projectsData.requirements || projectsData.data || [])
      .filter((eachItem: any) => eachItem.status.toLowerCase() === "open")
      .slice(0, 3);

    const categories = categoriesRes.ok
      ? (await categoriesRes.json()).data
      : [];

    return { cms, providers, projects, categories };
  } catch (error) {
    console.error("[HomePage] Data Fetch Error:", error);
    return { cms: null, providers: [], projects: [], categories: [] };
  } finally {
    setResLoading(false);
  }
}

useEffect(() => {
  async function fetchData() {
    const res = await getData();
    setData(res);
  }

  fetchData();
}, []);

if (resLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

const { cms, providers, projects, categories } = data;
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <HomeHero cms={cms} />

      {/* Features */}
      <section className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            How Spark Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cms?.homeWorkSection?.map((section: any, index: number) => (
              <div
                key={index}
                className="flex flex-col gap-4 items-center text-center"
              >
                <img src={section.image} alt="" />
                <div className="">
                  <h3 className="text-2xl font-bold">{section.title}</h3>
                  <p className="text-gray-500">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories - CMS Driven */}
      <section
        className="py-4 px-4"
        style={{
          backgroundImage: "url('/images/category-background.png')",
        }}
      >
        <div className="max-w-6xl mx-auto flex justify-center flex-col">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border border-orangeButton mb-2">
              <span className="text-xs font-medium text-slate-600 capitalize">
                Service Categories
              </span>
            </div>
            <h2 className="stext-mediun uppercase my-custom-class font-bold text-black ">
             {cms?.homeServiceTitle}
              {/* <span className="text-blueButton font-bold my-custom-class">
                any project
              </span> */}
            </h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
             {cms?.homeServiceSubTitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
            {(categories && categories.length > 0 ? categories : []).map(
              (category: any) => {
                const colors = colorMap[category.color] || colorMap.blue;
                const serviceLink = `/services/${category._id}`;

                return (
                  <div
                    key={category._id}
                    className={`group bg-white/70 backdrop-blur-sm rounded-4xl px-6 py-6 border pl-12 ${colors.hover} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <img
                        src={category?.icon || "/images/icon-1.png"}
                        alt=""
                        className="h-10"
                      />
                      <h3
                        className={`text-2xl font-bold text-blueButton group-hover:${colors.text} transition-colors`}
                      >
                        {category.title}
                      </h3>
                    </div>

                    {/* Subcategories */}
                    <div className="space-y-3">
                      {(category.children.slice(0, 6) || []).map(
                        (sub: any, index: number) => (
                          <p
                            key={index}
                            className={`block text-slate-500 text-sm hover:${colors.text} hover:translate-x-2 transition-all duration-200 font-medium`}
                          >
                            {/* <Link
      key={index}
      href={`/services/${category.slug}/${sub.slug}`}  // or your serviceLink
    > */}
                            → {sub.title}
                            {/* </Link> */}
                          </p>
                        ),
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </div>
          <div className="flex justify-center items-center">
            <Link href="/services">
              <Button
                className="rounded-full py-2 text-lg font-bold bg-gradient-to-r from-[#F54A0C] to-[#2C34A1]"
                size={"lg"}
              >
                Browse all services →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Public Requirements - From API */}
      {projects.length > 0 && (
        <section className="py-6 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border border-orangeButton mb-2">
                <span className="text-xs font-medium text-slate-600 capitalize">
                  Newly added
                </span>
              </div>
              <h2 className="stext-mediun uppercase font-extrabold text-black ">
                {cms?.recentRequirementTitle || "Requirements"}
              </h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                {cms?.recentRequirementSubTitle || "Discover opportunities from businesses lookking for your services"}
              </p>
            </div>
            {/* <div className="grid md:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <div key={project._id} className="hover:shadow-lg transition-shadow rounded-3xl border border-slate-300">
                  <div className="">
                    <div className="text-lg"><img src={project.image} alt="" className="rounded-t-3xl" /></div>
                    <div className="flex items-center justify-between mb-2 px-8 mt-4">
                      <Badge variant="outline" className="rounded-full px-2 bg-gray-100 font-semibold text-[10px]">{project.category}</Badge>
                      <span className="text-sm text-muted-foreground text-orangeButton font-semibold">{project.timeline}</span>
                    </div>
                    <h3 className="text-lg px-8 capitalize">{project.title}</h3>
                  </div>
                  <div className="pb-10 px-8">
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-col gap-4">
                      <span className="font-bold text-lg text-blueButton">{project.budget}</span>
                     
                    </div>
                  </div>
                   <div className="pb-10 px-6">
                        <Button variant="outline" size="sm" asChild className="bg-black text-white rounded-full text-xs">
                          <Link href="/login?to=project-enquiries">Submit Proposal →</Link>
                        </Button>
                      </div>
                </div>
              ))}
            </div> */}

            <div className="grid md:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <div
                  key={project._id}
                  className="rounded-3xl border border-slate-200 bg-white hover:shadow-lg transition-shadow
      flex flex-col h-full"
                >
                  {/* Image */}
                  <img
                    src={project.image || "/requirements.jpg"}
                    alt={project.title}
                    className="w-full h-[220px] object-cover rounded-t-3xl"
                  />

                  {/* Category + Timeline */}
                  <div className="flex items-center justify-between px-6 mt-4">
                    <Badge
                      variant="outline"
                      className="rounded-full bg-gray-100 text-[11px] font-semibold px-3 py-1"
                    >
                      {project.category}
                    </Badge>
                    <span className="text-sm font-semibold text-black">
                      Timeline - <span className="text-red-500">{project.timeline}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="px-6 mt-1 text-lg font-semibold capitalize">
                    {project.title}
                  </h3>

                  {/* Description */}
                  {/* <div className="px-6 mt-1">
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {project.description}
                    </p>
                  </div> */}

                  {/* Budget */}
                  <div className="mt-auto">
                    <div className="px-6 mt-1">
                      <span className="text-lg font-bold text-blueButton">
                        ${project.budgetMin.toLocaleString()} - $
                        {project.budgetMax.toLocaleString()}
                      </span>
                    </div>

                    {/* Button */}
                    <div className="px-6 pb-6 mt-1">
                      <Link href={`/login?to=requirement-details&id=${project._id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-black text-white rounded-full text-xs px-5 py-2 hover:bg-black"
                        >
                          View Details →
                        </Button>
                      </Link>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center">
              <Link href="/browse">
                <Button
                  className="rounded-full py-2 mt-8 text-lg font-bold bg-gradient-to-r from-[#F54A0C] to-[#2C34A1]"
                  size={"lg"}
                >
                  Browse all requirements →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Top Providers - From API */}
      {providers.length > 0 && (
        <section className="py-6 px-4 bg-blueBackground">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border border-orangeButton mb-2">
                <span className="text-xs font-medium text-slate-600 capitalize">
                  Top Agencies
                </span>
              </div>
              <h2 className="text-mediun uppercase font-extrabold text-black ">
                {cms?.topProvidersTitle || "Top Providers"}
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {cms?.topProvidersSubTitle || "Discover opportunities from businesses lookking for your services"}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[...providers]
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .map((provider: any) => (
                <div
                  key={provider._id}
                  className="hover:shadow-lg transition-shadow rounded-3xl border border-slate-300 bg-white
                 flex flex-col h-full"
                >
                  <div className="">
                    <div className="text-lg w-full h-[200px] overflow-hidden rounded-t-3xl ">
                      <img
                        src={provider.coverImage || "/requirements.jpg"}
                        alt=""
                        className="rounded-t-3xl w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-2 px-8 mt-4">
                      {/* FEATURED & VERIFIED BADGES */}
                      <div className="flex items-center gap-2">
                        {provider.isVerified && (
                          <Badge
                            variant="outline"
                            className="bg-blueButton text-white rounded-full px-3 py-0.5 text-[10px] font-semibold"
                          >
                            Verified
                          </Badge>
                        )}
                        {/* {provider.isFeatured && (
                          <Badge className="bg-orangeButton text-white rounded-full px-3 py-0.5 text-[10px] font-semibold">
                            Featured
                          </Badge>
                        )} */}
                      </div>

                      {/* ⭐ RATING STARS */}
                      <div className="flex items-center justify-center gap-0.2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill={i < provider.rating ? "#F59E0B" : "#D1D5DB"} // yellow or gray
                            className="w-4 h-4"
                          >
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 
        0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 
        1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 
        1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                        ))}

                        <span className="text-xs font-semibold text-gray-700 ml-1">
                          {provider.rating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg px-8 font-bold capitalize">
                      {provider.name}
                    </h3>
                  </div>
                  <div className="pb-4 px-8 flex flex-col flex-1">
                    <p className="text-sm text-gray-500 mb-0 line-clamp-1">
                        {provider.description}
                      </p>
                    <div className="flex flex-col h-full gap-4">
                      {/* SERVICES BADGES */}
                      <div className="flex gap-2 pt-2 overflow-hidden whitespace-nowrap">
                        {provider.services?.length > 0 ? (
                          provider.services
                            .slice(0, 2)
                            .map((service: string, idx: number) => (
                              <span
                                key={idx}
                                className="bg-gray-100 text-black px-2 py-1 rounded-full text-xs font-semibold"
                              >
                                {service}
                              </span>
                            ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            No services listed
                          </span>
                        )}
                      </div>

                      {/* VIEW DETAILS BUTTON */}
                      <div className="mt-auto">
                        <Button
                          variant="outline"
                          size="default"
                          asChild
                          className="bg-blueButton text-white rounded-full text-xs"
                        >
                          <Link
                            href={`/provider/${provider.id || provider._id}`}
                          >
                            View Profile →
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-0">
              <Button
                variant="outline"
                className="rounded-full py-2 mt-6 text-lg font-bold bg-gradient-to-r from-[#F54A0C] to-[#2C34A1] text-white"
                size={"lg"}
                asChild
              >
                <Link href="/providers">View All Providers →</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-4 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-4xl font-extralight">
            {cms?.getStartedTitle || "Ready to Get Started?"}
          </h3>
          <p className="text-base max-w-sm mx-auto text-slate-500">
            {cms?.getStartedSubtitle || "Join thousands of businesses finding the right service providers on Spark."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
            <Button
              size="lg"
              className="bg-orangeButton font-semibold text-sm text-white rounded-full hover:bg-gray-100"
              asChild
            >
              <Link href="/register?type=seeker">Post a requirement</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-blueButton font-semibold text-sm text-white rounded-full hover:bg-gray-100"
              asChild
            >
              <Link href="/register?type=provider">Become a provider</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
