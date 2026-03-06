"use client"

import { useState,useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { cn } from "@/lib/utils";

interface FiltersState {
  serviceType: string
  status: string
  minRating: number
  budgetRange: [number, number]
  title: ""
}

interface FiltersPanelProps {
  onFiltersChange: (filters: FiltersState) => void
  className?: string
}

export function FiltersPanel({ onFiltersChange, className }: FiltersPanelProps) {
  const [filters, setFilters] = useState<FiltersState>({
    serviceType: "",
    status: "",
    minRating: 0,
    budgetRange: [0, 100000],
    title:"",
  })
  const [skillInput, setSkillInput] = useState("")

   //dropdown search for the services offered
  const [serviceCategories, setServiceCategories] = useState([]);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [selectedService, setSelectedService] = useState("");

  const [open, setOpen] = useState(false);
  const ITEMS_PER_LOAD = 4;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [items, setItems] = useState([]);
  const subCategories = (serviceCategories || []).flatMap(
    (category) => category?.children,
  );
   useEffect(() => {
      loadData();
    }, []);
   
    const loadData = async () => {
    
      try {
        
        const res = await fetch("/api/service-categories");
        const servicData = await res.json();
        setServiceCategories(servicData.data || []);
  
       
  
        
      } catch (error) {
        console.log("Failded To retrive the data:::", error);
       
      } 
    };
  

  const serviceTypes = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Digital Marketing",
    "Content Writing",
    "Data Analysis",
    "Consulting",
  ]
  

  const statues = ["UnderReview","Open", "Closed", "shortlisted", "negotation", "Allocated","NotApproved"]

  const handleFilterChange = (key: keyof FiltersState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  // const addSkill = () => {
  //   if (skillInput.trim() && !filters.skills.includes(skillInput.trim())) {
  //     const newSkills = [...filters.skills, skillInput.trim()]
  //     handleFilterChange("skills", newSkills)
  //     setSkillInput("")
  //   }
  // }

  // const removeSkill = (skill: string) => {
  //   const newSkills = filters.skills.filter((s) => s !== skill)
  //   handleFilterChange("skills", newSkills)
  // }

  const clearFilters = () => {
    const clearedFilters: FiltersState = {
      serviceType: "",
      status: "",
      minRating: 0,
      budgetRange: [0, 100000],
      title: "",
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  return (
    <Card className="bg-[#fff] rounded-[16px]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5"/>
            <span className="my-custom-class text-[14px] font-normal -ml-1 text-[#4B4B4B]"> Filter</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters} className=" hover:bg-transparent focus:bg-transparent active:bg-transparent  hover:text-[#2B67F6] my-custom-class text-[#2B67F6] text-[12px]" >
            Reset All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Type */}
        {/* <div className="space-y-2 my-custom-class">
          <Label className="text-[14px] mb-0 text-[#98A0B4] font-semibold">Service Type</Label>
          <Select value={filters.serviceType} onValueChange={(value) => handleFilterChange("serviceType", value)}>
            <SelectTrigger className="border-2 data-[placeholder]:text-[#98A0B4] border-[#D0D5DD] rounded-full text-[12px]">
              <SelectValue placeholder="Select service type"  />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}

        <div className="w-full min-w-0">
           <Label className="text-[14px] mb-0 text-[#98A0B4] font-semibold">Service Type</Label>
                  <Select
                    open={open}
                    onOpenChange={setOpen}
                    value={filters.serviceType}
                  >
                    <SelectTrigger
                      className="border-2 data-[placeholder]:text-[#98A0B4] border-[#D0D5DD] rounded-full text-[12px]"
                    >
                      <span className="text-sm md:text-base">
                        {filters.serviceType || "Select Service"}
                      </span>
                    </SelectTrigger>

                    <SelectContent
                      side="bottom"
                      align="start"
                      sideOffset={8}
                      className="p-0 rounded-2xl"
                    >
                      <div className="flex">
                        {/* LEFT: Subcategories */}
                        <div className="min-w-[220px] border-r">
                          {subCategories.map((sub) => (
                            <div
                              key={sub.slug}
                              onMouseEnter={() => setActiveSubCategory(sub)}
                              className="px-4 py-2 cursor-pointer  text-sm hover:bg-gray-100"
                            >
                              {sub.title}
                            </div>
                          ))}
                        </div>

                        {/* RIGHT: Items */}
                        {activeSubCategory && (
                          <div className="min-w-[240px]">
                            {activeSubCategory.items.map((item) => (
                              <div
                                key={item.slug}
                                onClick={() => {
                                  setSelectedService(item.title); // ✅ SHOW IN FIELD
                                  // setServiceFilter(item.title); // your filter logic
                                  handleFilterChange("serviceType", item.title)
                                  setOpen(false); // ✅ close dropdown
                                }}
                                className="px-4 py-2 cursor-pointer text-sm hover:bg-gray-100"
                              >
                                {item.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-[14px] mb-0 text-[#98A0B4] font-semibold">Status</Label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="border-2 data-[placeholder]:text-[#98A0B4] border-[#D0D5DD] rounded-full text-[12px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statues.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating */}
        {/* <div className="space-y-2">
          <Label className="text-[14px]  mb-2 text-[#98A0B4] font-semibold">Minimum Rating: <span className="text-end ml-auto text-[#2B67F6] text-[12px]">{filters.minRating}/5</span></Label>
          <Slider
            value={[filters.minRating]}
            onValueChange={(value) => handleFilterChange("minRating", value[0])}
            max={5}
            min={0}
            step={0.5}
            className={cn(
              "w-full",
              "[&_[data-radix-slider-track]]:bg-[#2B67F6]",           // inactive track (customize as needed)
              "[&_[data-radix-slider-range]]:bg-[#2B67F6]",           // filled range color
              "[&_[data-radix-slider-thumb]]:bg-[#2B67F6]",           // thumb color
              "[&_[data-radix-slider-thumb]]:focus:ring-[#2B67F6]" // optional: focus ring
            )}
          />
        </div> */}

        {/* Budget Range */}
        <div className="space-y-2">
          <Label className="text-[14px]  mb-2 text-[#98A0B4] font-semibold">
            Budget Range: ${filters.budgetRange[0].toLocaleString()} - ${filters.budgetRange[1].toLocaleString()}
          </Label>
          <Slider
            value={filters.budgetRange}
            onValueChange={(value) => handleFilterChange("budgetRange", value as [number, number])}
            max={100000}
            min={0}
            step={1000}
            className="w-full"
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label className="text-[14px]  mb-0 text-[#98A0B4] font-semibold">Title</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Requirement title..."
              value={filters.title}
              onChange={(e) => handleFilterChange("title",e.target.value)}
              // onKeyPress={(e) => e.key === "Enter" && addSkill()}
              className="border-2 border-[#D0D5DD] rounded-full placeholder:text-[#98A0B4]"
            />
            {/* <Button onClick={addSkill} size="sm" className="bg-[#F54A0C] rounded-full mt-1 hover:bg-[#F54A0C] active:[#F54A0C]">
              Add
            </Button> */}
          </div>
          {/* {filters.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                </Badge>
              ))}
            </div>
          )} */}
        </div>
      </CardContent>
    </Card>
  )
}
