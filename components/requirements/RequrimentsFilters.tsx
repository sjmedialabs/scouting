import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface RequirementsFiltersProps {
  categories: string[]
  onApply?: () => void
}

export function RequirementsFilters({
  categories,
  onApply,
}: RequirementsFiltersProps) {
  return (
    <div className="rounded-[22px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-4 sm:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_220px_220px_140px] gap-3 items-center">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Requirement"
            className="h-12 pl-10 rounded-full text-[15px]"
          />
        </div>

        {/* Category */}
        <Select>
          <SelectTrigger className="h-12 rounded-full text-[15px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat.toLowerCase()}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Budget */}
        <Select>
          <SelectTrigger className="h-12 rounded-full text-[15px]">
            <SelectValue placeholder="Budget Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="under-1k">Under $1,000</SelectItem>
            <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
            <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
            <SelectItem value="10k-plus">$10,000+</SelectItem>
          </SelectContent>
        </Select>

        {/* Apply */}
        <Button
          onClick={onApply}
          className="h-12 rounded-full bg-[#F54A0C] hover:bg-[#d93f0b] text-[15px]"
        >
          <Filter className="h-4 w-4 mr-2" />
          Apply Filter
        </Button>
      </div>
    </div>
  )
}