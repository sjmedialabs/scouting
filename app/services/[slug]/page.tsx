"use client";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  Code,
  Shield,
  PenTool,
  Layers,
  Briefcase,
  Package,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import ServiceCard from "@/components/ServiceCard";
import StatsGrid from "@/components/StatsGrid";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";

interface PageProps {
  params: {
    slug: string;
  };
}
const providers = [
  {
    id: "1",
    verified: true,
    featured: true,
    name: "SJ Media Labs",
    cover: "/Creative_Design_Studio.jpg",
    rating: 4.9,
    desc: "Award-winning design studio creating exceptional user experiences and brand identities.",
    tags: ["UI/UX Design", "Branding", "Web Design"],
    location: "San Francisco, CA",
    projects: 99,
    response: "2 hours",
    rate: "$80-160/hour",
  },
  {
    id: "2",
    verified: true,
    featured: true,
    name: "Pixel Perfect Design",
    cover: "/TechCraft_Solutions.jpg",
    rating: 4.8,
    desc: "Creative design agency specializing in visual identity and print design solutions.",
    tags: ["Graphic Designing", "Print Design", "Logo Design"],
    location: "Portland, OR",
    projects: 49,
    response: "3 hours",
    rate: "$60-120/hour",
  },
];

export default function ServicePage({ params }: PageProps) {
  const slug = params.slug;
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  const [matchedServiceProviders, setMatchedServiceProviders] = useState<any[]>(
    [],
  );

  const loadData = async () => {
    setLoading(true);
    setFailed(false);
    try {
      // Fetch service providers based on slug
      const response = await fetch(`/api/providers`);
      const data = await response.json();

      const filteredProviders = data.providers.filter((eachItem: any) =>
        eachItem.services.some((service: string) =>
          service.toLowerCase().includes(slug.replace(/-/g, " ").toLowerCase()),
        ),
      );
      console.log("Filtered Providers:", filteredProviders);
      setMatchedServiceProviders(filteredProviders);
    } catch (err) {
      setFailed(true);
      console.log("Error fetching service providers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = [
    {
      label: "Total Providers",
      value: matchedServiceProviders.length.toString(),
    },
    {
      label: "Avg Rating",
      value: (
        matchedServiceProviders.reduce((sum, p) => sum + (p.rating || 0), 0) /
        (matchedServiceProviders.length || 1)
      ).toFixed(1),
    },
    {
      label: "Verified Agencies",
      value: matchedServiceProviders
        .filter((p) => p.isVerified)
        .length.toString(),
    },
    {
      label: "Featured Agencies",
      value: matchedServiceProviders
        .filter((p) => p.isFeatured)
        .length.toString(),
    },
  ];

  return (
    <main className="bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative isolate items-center justify-center text-center min-h-80 sm:min-h-[480px] md:min-h-[360px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/Service_Details_Hero_Image.jpg"
            alt="Service Details Banner Image"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
        </div>
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 py-20 text-center md:px-8">
          <h1
            className="mx-auto max-w-[980px] text-[clamp(20px,2.4vw,20px)]  md:text-5xl font-extrabold text-orange-600 leading-normal"
            style={{ fontFamily: "CabinetGrotesk2" }}
          >
            {slug.replace(/-/g, " ").toUpperCase()}
          </h1>
          <p className="mx-auto mt-4 max-w-[720px] text-center text-base text-[clamp(16px,2.4vw,20px)] text-[#adb0b3] md:text-xl tracking-wide font-normal text-balance leading-[1.3]">
            {
              "Find expert business consultants and service providers for strategy, operations, financial planning, market research, and business development solutions."
            }
          </p>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-white border-y border-[#E7E7E9] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-6 md:px-10 py-10 flex-col md:flex-row flex items-center gap-4 justify-around md:justify-around md:gap-10 ">
          <div className="flex flex-col items-center md:items-start">
            <h2
              className="text-[20px] md:text-[30px] font-extrabold leading-[1.15] text-[#0E0E0E]"
              style={{ fontFamily: "" }}
            >
              {`Need ${slug.replace(/-/g, " ")} Services?`}
            </h2>
            <p className="mt-3 text-[16px] md:text-[20px] leading-[1.3] text-[#B3B6BA] font-normal md:ml-21 text-center md:text-start md:max-w-[500px]">
              {`Connect with expert ${slug.replace(/-/g, " ")} professionals for your needs`}
            </p>
          </div>

          {/* Divider */}
          <div
            className="hidden md:block  h-25 w-px bg-[#D6D6D8] "
            aria-hidden
          />

          {/* Button */}
          <div className="flex items-start justify-start">
            <button
              onClick={() => router.push("/register")}
              className="h-12 px-10 md:px-6 rounded-full 
                      bg-[#2c34a1] hover:bg-[#2B34C3] 
                      text-white text-[12px] font-semibold 
                      transition-all duration-200 cursor-pointer"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {"Click here to post project"} →
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section*/}
      <StatsGrid stats={stats} />

      {/* Cards Section*/}
      {!loading && !failed && matchedServiceProviders.length > 0 && (
        <section className="bg-white pb-16">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 sm:px-6 md:px-8">
            {(matchedServiceProviders || []).map((p) => (
              <ServiceCard key={p.id} provider={p} />
            ))}
          </div>
        </section>
      )}

      {/*Loading */}

      {loading && (
        <div className="mt-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {!loading && !failed && matchedServiceProviders.length === 0 && (
        <div className="flex flex-col justify-center items-center text-center mt-10">
          <h1 className="text-center font-semibold text-3xl mt-20 mb-20">
            No service providers found for {slug.replace(/-/g, " ")}
          </h1>
        </div>
      )}
    </main>
  );
}
