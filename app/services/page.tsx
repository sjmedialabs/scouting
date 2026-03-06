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

// --------------------------------------
// STATIC DATA (Replace with API in future)
// --------------------------------------
const STATIC_CATEGORIES = [
  {
    id: 1,
    title: "Development",
    icon: "/images/Group1.jpg",
    subcategories: [
      "Mobile App Development",
      "Software Development",
      "Web Development",
      "AR/VR",
      "Artificial Intelligence",
      "Blockchain",
    ],
  },
  {
    id: 2,
    title: "Advertising",
    icon: "/images/Group2.jpg",
    subcategories: [],
  },
  {
    id: 3,
    title: "Business Services",
    icon: "/images/Group3.jpg",
    subcategories: [],
  },
  {
    id: 4,
    title: "IT Services",
    icon: "/images/Group4.jpg",
    subcategories: [],
  },
  {
    id: 5,
    title: "Design & Production",
    icon: "/images/Group5.jpg",
    subcategories: [],
  },
  {
    id: 6,
    title: "Marketing",
    icon: "/images/Group6.jpg",
    subcategories: [],
  },
  {
    id: 7,
    title: "Advertising & Marketing",
    icon: "/images/Group7.jpg",
    subcategories: [],
  },
  {
    id: 8,
    title: "Design & Production",
    icon: "/images/Group8.jpg",
    subcategories: [],
  },
  {
    id: 9,
    title: "Cyber Security",
    icon: "/images/Group9.jpg",
    subcategories: [],
  },
  {
    id: 10,
    title: "Business Services",
    icon: "/images/Group10.jpg",
    subcategories: [],
  },
  {
    id: 11,
    title: "Resources",
    icon: "/images/Group11.jpg",
    subcategories: [],
  },
  {
    id: 12,
    title: "Packages",
    icon: "/images/Group12.jpg",
    subcategories: [],
  },
];

export default function ServicesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [cms, setCms] = useState<any>(null);
  // --------------------------------------
  // FUTURE API SUPPORT: Just uncomment this
  // --------------------------------------

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/service-categories");
      const data = await res.json();
      if (data.success) {
        const mainCats = data.data.filter((c: any) => c.parent === null);
        setCategories(mainCats);
        console.log("Categories response data from api", mainCats);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/cms");
      const data = await res.json();
      setCms(data);
    }
    fetchCategories();
  }, []);
  return (
    <div className="w-full min-h-screen bg-white pb-20">
      {/* ---------- Header Section ---------- */}
      <div
        className="w-full bg-gray-100 py-20 text-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url("${cms?.commonBgImage || "/images/banner.jpg"}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
        }}
      >
        <h1 className="text-4xl md:text-5xl font-black text-orangeButton">
          Services
        </h1>
        <p className="text-gray-400 text-xl md:text-2xl font-medium">
          Find verified professionals for your next project
        </p>
      </div>

      {/* ---------- Services List ---------- */}
      <div className="max-w-6xl mx-auto mt-10 space-y-1 px-4 py-12">
        {categories.map((cat) => {
          const isOpen = openId === cat._id;

          return (
            <div
              key={cat._id}
              className="border border-gray-400 rounded-xl px-5 py-4 bg-white transition-all"
            >
              {/* Category Header */}
              <div
                onClick={() => setOpenId(isOpen ? null : cat._id)}
                className="flex justify-between items-center cursor-pointer px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      cat.icon ||
                      "/uploads/44eaa969-97bd-41fe-8a4b-cff26356de06-Group%20208.jpg"
                    }
                    alt=""
                    className="h-10 w-10"
                  />
                  <span className="font-bold text-2xl text-blueButton">
                    {cat.title}
                  </span>
                </div>

                {cat.children.length > 0 ? (
                  isOpen ? (
                    <ChevronDown className="w-7 h-7" />
                  ) : (
                    <ChevronRight className="w-7 h-7" />
                  )
                ) : (
                  <ChevronRight className="w-7 h-7" />
                )}
              </div>

              {/* Subcategories - Dropdown */}
              {isOpen && cat.children.length > 0 && (
                <div className="mt-3 pl-10 space-y-2 transition-all flex flex-wrap gap-12 font-semibold">
                  {cat.children.map((sub: any, i: number) => (
                    <div key={i} className="text-gray-500 hover:text-black ">
                      <span> → {sub.title}</span>
                      {/* Inner items */}
                      {sub.items?.length > 0 && (
                        <div className="ml-6 mt-1 flex flex-col gap-1">
                          {sub.items.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="text-gray-500 hover:text-black cursor-pointer"
                            >
                              <Link href={`/services/${item.slug}`}>
                                • {item.title}
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Load More Button */}
        <div className="flex justify-center mt-6">
          <Button
            variant="default"
            size="lg"
            className="px-5 border font-medium bg-gray-100 rounded-2xl text-black hover:bg-gray-100"
          >
            Load More Services
          </Button>
        </div>
      </div>
    </div>
  );
}
