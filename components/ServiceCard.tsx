"use client";

import {Star,  Users } from "lucide-react";
import { Provider } from "./types/service";
import { useRouter } from "next/navigation";



export default function ServiceCard({ provider }: { provider: Provider }) {
    const p = provider
    const router=useRouter();

     const handleContact = () => {
    if (!provider.email) return;
    window.location.href = `mailto:${provider.email}?subject=Service Inquiry&body=Hi ${provider.name},%0D%0A%0D%0AI am interested in your services.`;
  };

    return (
        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md flex flex-col h-full">
            <div className="aspect-16/10 w-full overflow-hidden">
                <img src={p?.coverImage || "/uploads/15ac2d8f-31f9-48ac-aadd-b67ba9f4d860-Artificial-intelligence-platforms-copy.jpg"} 
                alt={p.name} 
                className="h-full w-full object-cover"/>
            </div>
            <div className="flex flex-col flex-1 sm:p-6 p-5 justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    {p.isVerified && (
                       <span className="inline-flex items-center rounded-full border bg-[#32359a] px-4 py-1 sm:text-xs font-medium text-white text-bold">
                            Verified
                        </span>
                    )}
                    {/* {p.isFeatured && (
                        <span className="inline-flex items-center rounded-full border bg-[#e84816] px-4 py-1 sm:text-xs font-medium text-white text-bold">
                            Featured
                        </span>
                    )} */}
                </div>

                {/* Rating section */}        
                <div className="flex items-center gap-1.5">
                 <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                     const fillValue = p.rating - i;
                    let fillColor = "#E2E2E2"; // default empty star

                     if (fillValue >= 1) fillColor = "#FFB400"; // full star
                    else if (fillValue > 0 && fillValue < 1) {
                      // half star – simulate with linear gradient using background mask
                     return (
                      <div
                       key={i}
                      className="relative h-4 w-4"
                      style={{
                          WebkitMask:
                          "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22black%22%3E%3Cpath d=%22M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.264L12 18.897l-7.417 4.637L6 15.27 0 9.423l8.332-1.268z%22/%3E%3C/svg%3E') center / contain no-repeat",
                         WebkitMaskRepeat: "no-repeat",
                        background: `linear-gradient(90deg, #FFB400 ${fillValue * 100}%, #E2E2E2 ${fillValue * 100}%)`,
                    }}
                 >
                 </div>
             );
            }

            return (
                <Star
                 key={i}
                 className="h-4 w-4"
                fill={fillColor}
                 stroke="none"
             />
             );
            })}
         </div>

         {/* Rating value and review count */}
         <span className="text-[14px] sm:text-[14px] font-semibold text-[#0E0E0E]">
         {p.rating.toFixed(1)}
        </span>
         {p.rating && (
         <span className="text-[14px] sm:text-[15px] text-[#7C7C7C]">
            ({p.reviewCount})</span>
         )}
        </div>
        </div>


                 {/* Title + Description */}
                <div className="flex items-start justify-between py-3">
                    <div>
                        <h3 className="text-3xl sm:text-3xl font-extrabold text-[#0E0E0E] leading-none"
                        style={{fontFamily: "CabinetGrotesk2"}}
                        >
                            {p.name} 
                        </h3>
                        <p className="py-1 text-sm font-bold text-[#adb0b3] leading-[1.2] -mt-0.5"
                        style={{fontFamily: "CabinetGrotesk2"}}
                        >
                            {p.description}
                        </p>    
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {Array.isArray(p.tags) && p.tags.map((tag) => (
                        <span 
                        key={tag} 
                        className="inline-flex items-center rounded-full
                         bg-[#f2f2f2] border px-5 py-0.5 text-ts sm:text-[14px] font-bold text-slate-700">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Location / Projects / Response */}
                <div className=" flex flex-wrap items-center gap-6 text-sm sm:text-sm font-bold text-[#616161] py-1">
                    <span className="inline-flex items-center gap-2">
                        <img
                        src="/Location_Icon.jpg"
                        alt="Location"
                        className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                        />
                        {p.location}
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <img
                        src="/Projects_Icon.jpg"
                        alt="Projects"
                        className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                        />
                        {p.projectsCompleted} projects
                        </span>
                    <span className="inline-flex items-center gap-2">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orangeButton" />
                        Team: {p.teamSize || "Not specified"}
                    </span>
                </div>
                    
                {/* Rate */}    
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-1 py-1">
                    <div className="text-lg  text-[#616161] font-bold">
                       Starting Price: 
                        <span className="font-bold"> {p.hourlyRate}/hr</span>
                    </div>
                </div>

                {/*Buttons*/}
                <div className="flex sm:flex-row sm:items-center sm:justify-between pt-3">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button className="mt-auto rounded-full bg-[#2c34a1] cursor-pointer px-4 py-3 text-sm font-bold text-white hover:bg-[#3f437e]" 
                    onClick={() => router.push(`/provider/${provider.id || provider._id}`)}>
                         View Profile  →
                    
                    </button>
                     <button
        className="w-full sm:w-40 bg-[#4d4d4d] cursor-pointer rounded-3xl text-white"
        onClick={handleContact}
      >
        Contact Provider
      </button>
                    </div>
                </div>
            </div>
        </div>
    )
}