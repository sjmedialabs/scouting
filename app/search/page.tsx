"use client";

import type React from "react";
import ServiceDropdown from "@/components/select-category-filter";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import type { Provider } from "@/components/types/service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import Image from "next/image";
import { categories } from "@/lib/mock-data";

const ITEMS_PER_LOAD = 4;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(query);
  const [serviceType, setServiceType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");

  const [dynamicProviders, setDynamicProviders] = useState<Provider[]>([]);
  const [filteredDynamicProviders, setDynamicFilteredProviders] = useState<
    Provider[]
  >([]);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProviders(query);
  }, [query]);

  useEffect(() => {
  const filtered = applyFilters(
    dynamicProviders,
    searchQuery,
    serviceType,
    budgetRange
  );

  setDynamicFilteredProviders(filtered);
}, [serviceType, budgetRange]);


  const fetchProviders = async (searchTerm: string) => {
    try {
      setLoading(true);

      const res = await fetch("/api/providers");
      const data = await res.json();

      setDynamicProviders(data.providers);

      const filtered = applyFilters(
        data.providers,
        searchTerm,
        serviceType,
        budgetRange
      );

      setDynamicFilteredProviders(filtered);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (
    providers: Provider[],
    searchText: string,
    serviceTypeValue: string,
    budgetValue: string
  ) => {
    let filtered = [...providers];

    if (searchText.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchText.toLowerCase()) ||
          p.services?.some((s) =>
            s.toLowerCase().includes(searchText.toLowerCase())
          )
      );
    }

    if (serviceTypeValue && serviceTypeValue !== "all") {
      filtered = filtered.filter((p) =>
        p.services?.some((s) =>
          s.toLowerCase().includes(serviceTypeValue.toLowerCase())
        )
      );
    }

    if (budgetValue) {
      filtered = filtered.filter((p) => {
        const min = p.minBudget ?? 0;
        const max = p.maxBudget ?? 0;

        if (budgetValue === "0k-5k") return max <= 5000;
        if (budgetValue === "5k-10k") return min >= 5000 && max <= 10000;
        if (budgetValue === "10k-20k") return min >= 10000 && max <= 20000;
        if (budgetValue === "20k+") return min > 20000;

        return true;
      });
    }

    return filtered;
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();

    const filtered = applyFilters(
      dynamicProviders,
      searchQuery,
      serviceType,
      budgetRange
    );

    setDynamicFilteredProviders(filtered);
    setVisibleCount(ITEMS_PER_LOAD);
  };

  const handleHighestRating = (value: string) => {
  let sortedData = [...filteredDynamicProviders];

  if (value === "high-to-low") {
    sortedData.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  } else if (value === "low-to-high") {
    sortedData.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
  }

  setDynamicFilteredProviders(sortedData);
};


  const clearFilters = () => {
  setSearchQuery("");
  setServiceType("");
  setBudgetRange("");
  setVisibleCount(ITEMS_PER_LOAD);
  setDynamicFilteredProviders(dynamicProviders);
};


  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative h-[320px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/Search-banner.jpg"
            alt="Search banner"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-white/10" />
        </div>

        <div className="relative z-10 text-center w-full px-4">
          <h1 className="text-orangeButton text-4xl font-extrabold mb-4">
            Search Results
          </h1>

          {/* SEARCH BAR
          <form
            onSubmit={handleSearch}
            className="mx-auto relative max-w-3xl border-2 border-[#c8d5e4] flex items-center bg-white rounded-full overflow-hidden"
          >
            <Input
              placeholder="Search Agency / Service"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 placeholder:text-gray-500 h-16 px-6 text-sm focus-visible:ring-0"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2
              flex items-center justify-center
              h-14 w-14 rounded-full bg-[#F54A0C] shadow-md rotate-90"
            >
              <Search className="text-white h-6 w-6" />
            </button>
          </form> */}

          {/* FILTER BAR (BROWSE STYLE) */}
          <div className="flex justify-center mt-6">
            <div
              className="w-full max-w-5xl bg-white rounded-[28px]
              shadow-[0_20px_40px_rgba(0,0,0,0.08)]
              px-6 py-5 border"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_auto_auto] gap-6 items-center">
                
                {/* SEARCH */}
                <div className="flex items-center gap-2 border-b border-[#dcdcdc] pb-2">
                  <Input
                    placeholder="Search Agency / Service"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    className="border-0 p-0 h-auto text-[15px]
                    placeholder:text-[#9b9b9b]
                    focus-visible:ring-0"
                  />
                </div>

                {/* SERVICE */}
                <ServiceDropdown
                  value={serviceType}
                  onChange={(value) => setServiceType(value)}
                  triggerClassName="
                    border-0 border-b border-[#dcdcdc] rounded-none px-0 pb-2
                    text-[15px] font-normal
                    focus-visible:ring-0 focus-visible:ring-offset-0
                    cursor-pointer
                    [&_span]:text-[#9b9b9b]
                    [&_span]:text-[15px]
                    [&_span]:font-normal
                  "
                />
                {/* BUDGET */}
                <Select onValueChange={(value) => setBudgetRange(value)}>
                  <SelectTrigger className="border-0 border-b border-[#dcdcdc] rounded-none px-0 pb-2
                              text-[15px]
                  focus-visible:ring-0 focus-visible:ring-offset-0
                  [&_span]:text-gray-500 cursor-pointer">
                    <SelectValue placeholder="Budget Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem 
                    className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white" 
                    value="0k-5k">Under $5k</SelectItem>
                    <SelectItem 
                    className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white"
                    value="5k-10k">$5k – $10k</SelectItem>
                    <SelectItem 
                    className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white"
                    value="10k-20k">$10k – $20k</SelectItem>
                    <SelectItem 
                    className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white"
                    value="20k+">More than $20k</SelectItem>
                  </SelectContent>
                </Select>

                {/* APPLY */}
                <Button
                  className="h-10 px-6 rounded-full bg-[#F54A0C] hover:bg-orange-600 text-white"
                  onClick={handleSearch}
                >
                  Apply
                </Button>

                {/* CLEAR */}
                <Button
                  variant="outline"
                  className="h-10 px-6 rounded-full bg-black text-white hover:bg-gray-900"
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="max-w-5xl mx-auto px-4 py-10">

        <div className="mb-6 flex items-center justify-between">
  {/* LEFT — COUNT */}
  <div className="text-lg text-gray-600">
    Agencies Found:
    <span className="font-semibold text-gray-700 ml-2">
      {filteredDynamicProviders.length}
    </span>
  </div>

  {/* RIGHT — RATING FILTER */}
  <Select onValueChange={handleHighestRating}>
    <SelectTrigger
      className="
        bg-[#f5f5f5]
        h-10
        w-[180px]
        rounded-full
        border border-[#e5e5e5]
        text-[#555]
        px-4
        focus:ring-0 cursor-pointer
      "
    >
      <SelectValue  placeholder="Sort by Rating" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem 
          className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white"
      value="high-to-low">
        High to Low
        </SelectItem>
      <SelectItem 
          className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white"
      value="low-to-high">
        Low to High
        </SelectItem>
    </SelectContent>
  </Select>
</div>


        {loading ? (
          <div className="text-center py-16 text-gray-500">Searching…</div>
        ) : filteredDynamicProviders.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No results found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredDynamicProviders.slice(0, visibleCount).map((provider) => (
              <ServiceCard
                key={provider.id ?? provider._id ?? provider.name}
                provider={provider}
              />
            ))}
          </div>
        )}

        {filteredDynamicProviders.length > visibleCount && (
          <div className="flex justify-center mt-12">
            <Button
              className="rounded-full px-8 py-3 bg-orangeButton text-white hover:bg-orange-400"
              onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_LOAD)}
            >
              Load More
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
