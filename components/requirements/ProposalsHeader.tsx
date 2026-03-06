import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

interface ProposalsHeaderProps {
  title?: string
  sortOptions?: { label: string; value: string }[]
  onSortChange?: (value: string) => void
}

export function ProposalsHeader({
  title = "List of Proposals",
  sortOptions = [
     { label: "All", 
      value: "all" },
    { label: "high - low", value: "price_desc" },
    { label: "low - high", value: "price_asc" },
   
  ],
  onSortChange,
}: ProposalsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-[22px] sm:text-[26px] font-medium text-[#8b8b8b]">
        {title}
      </h2>

      <Select onValueChange={onSortChange}>
        <SelectTrigger
          className="h-11 w-[200px] rounded-full bg-[#f6f3f2] 
                     border border-[#e5e5e5] text-sm text-[#444] cursor-pointer"
        >
          <SelectValue placeholder="Sort by pricing" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((opt) => (
            <SelectItem className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white"
             key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}