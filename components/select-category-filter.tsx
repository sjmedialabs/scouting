"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

const ITEMS_PER_LOAD = 4;

export default function ServiceDropdown({
  value,
  onChange,
  triggerClassName = "",
  triggerSpanClassName="",
  contentClassName = "",
  leftPanelClassName = "",
  rightPanelClassName = "",
  placeholder = "Select Service",
}) {
  const [serviceCategories, setServiceCategories] = useState([]);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/service-categories");
      const data = await res.json();
      setServiceCategories(data?.data || []);
    };

    fetchCategories();
  }, []);

  const subCategories = (serviceCategories || []).flatMap(
    (category) => category?.children || []
  );

  return (
    <div className="w-full min-w-0">
      <Select open={open} onOpenChange={setOpen} value={value}>
        <SelectTrigger
          className={`
            mt-1 border-0 border-b-2 border-b-[#b2b2b2]
            rounded-none shadow-none focus:outline-none cursor-pointer
             w-full text-sm md:text-base h-12  px-3
            ${triggerClassName}
          `}
        >
          <span className={` ${triggerSpanClassName}`}>
            {value || placeholder}
          </span>
        </SelectTrigger>

        <SelectContent
  side="bottom"
  align="start"
  sideOffset={8}
  className={`p-0 rounded-2xl overflow-hidden shadow-xl ${contentClassName}`}
>
  <div className="flex h-[280px]">
    
    {/* LEFT PANEL — SCROLLABLE */}
    <div
      className={`min-w-[220px] border-r bg-white overflow-y-auto ${leftPanelClassName}`}
    >
      {subCategories.map((sub) => (
        <div
          key={sub.slug}
          onMouseEnter={() => setActiveSubCategory(sub)}
          className={`px-4 py-2 cursor-pointer text-sm transition-colors
            ${
              activeSubCategory?.slug === sub.slug
                ? "bg-orange-50 text-[#F54A0C] font-medium"
                : "hover:bg-gray-100"
            }`}
        >
          {sub.title}
        </div>
      ))}
    </div>

    {/* RIGHT PANEL — FIXED */}
    <div
      className={`min-w-[260px] bg-white ${rightPanelClassName}`}
    >
      {activeSubCategory ? (
        <div className="h-full overflow-y-auto">
          {activeSubCategory.items?.map((item) => (
            <div
              key={item.slug}
              onClick={() => {
                onChange(item.title);
                setOpen(false);
              }}
              className="px-4 py-2 cursor-pointer text-sm hover:bg-orange-50 transition-colors"
            >
              {item.title}
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-4 text-xs text-gray-400">
          Hover a category
        </div>
      )}
    </div>
  </div>
</SelectContent>

      </Select>
    </div>
  );
}
