import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, CalendarDays, Inbox } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { MdLocationPin } from "react-icons/md";

interface ProposalCardProps {
  category: string
  title: string
  description: string
  budget: string
  timeline: string
  location: string
  postedAgo: string
  onView?: () => void
  onSubmit?: () => void
}

export function ProposalCard({
  category,
  title,
  description,
  budget,
  timeline,
  location,
  postedAgo,
  onView,
  onSubmit,
}: ProposalCardProps) {
  return (
    <div className="rounded-[26px] border border-[#e6e6e6] bg-[#f4fbff] overflow-hidden h-full flex flex-col">
      {/* Top */}
<div className="relative p-6 pt-4 pb-1">
  
  {/* Title + Posted On */}
  <div className="flex items-start justify-between">
    <h3 className="text-[20px] sm:text-[22px] font-semibold text-[#2c34a1]">
      {title}
    </h3>

    <div className="flex items-center gap-1 text-sm font-medium text-black whitespace-nowrap">
      <CalendarDays className="h-4 w-4" />
      Posted On :
      <span className="text-[#ff4d00]">
        {new Date(postedAgo).toLocaleDateString()}
      </span>
    </div>
  </div>

  {/* Description */}
  <div className="mt-1">
    <p className="text-[14px] text-[#8b8b8b] leading-relaxed line-clamp-1">
      {description}
    </p>
  </div>

</div>

      {/* Bottom */}
      <div className="p-6 pt-0 mt-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Meta */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-[#ff4d00]" />
            <span className="font-semibold">{budget}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#ff4d00]" />
            <span className="font-semibold">{timeline}</span>
          </div>

          <div className="flex items-center gap-2">
           
            <MdLocationPin className="h-4 w-4 text-[#ff4d00]"/>
            <span className="font-semibold">
              {location}
              </span>
          </div>
        </div>
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-3 m-4 mt-0 sm:flex-row sm:gap-2">
          {/* <Button
            onClick={onView}
            className="rounded-full bg-[#2c34a1] hover:bg-[#2c34a1] px-6"
          >
            View Details →
          </Button> */}

          {/* <Button
            onClick={onSubmit}
            className="rounded-full bg-black hover:bg-black px-6"
          >
            Submit Proposal
          </Button> */}
         <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        onClick={onSubmit}
        className="rounded-full bg-black hover:bg-black px-6"
        
      >
        Submit Proposal
      </Button>
    </TooltipTrigger>

    <TooltipContent>
      <p>Login to dashboard</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
        </div>
      </div>
    
  )
}