"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CiCalendar } from "react-icons/ci"
import { CiFilter } from "react-icons/ci"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AiOutlineDollar } from "react-icons/ai"
import { VscSend } from "react-icons/vsc"
import { Input } from "@/components/ui/input"
import { FaArrowRightLong } from "react-icons/fa6"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Calendar, Eye, Lock } from "lucide-react"
import type { Requirement } from "@/lib/types"
import { categories } from "@/lib/mock-data"
import ServiceDropdown from "../select-category-filter"
import { Unbounded } from "next/font/google"

interface BrowseRequirementsProps {
  requirements: Requirement[]
  subscriptionTier: string
  onViewDetails: (requirementId: string) => void
  onSubmitProposal: (requirementId: string) => void
}

export function BrowseRequirements({
  requirements,
  subscriptionTier,
  onViewDetails,
  onSubmitProposal,
}: BrowseRequirementsProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState<Number>()
  const [locationOpen, setLocationOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState()
  // const [ratingFilter, setRatingFilter] = useState("any")
  const [budgetFilter, setBudgetFilter] = useState("all")

  // const[locationFilter,setLocationFilter]=useState("");
  const[serviceFilter,setServiceFilter]=useState("all");
  const[ratingFilter,setRatingFilter]=useState("any");
  const[filteredRequirements,setFilteredRequirements]=useState<Requirement[]>(requirements)

  const handleSearch = () => {
  console.log("Search triggered with:", {
    location: searchTerm,
    service: serviceFilter,
    rating: ratingFilter,
  })
  let tempFilteredRequirements=[...requirements];
  if(searchTerm){
    tempFilteredRequirements=tempFilteredRequirements.filter((eachItem)=>eachItem?.budgetMin>searchTerm);
  }
  if(serviceFilter && serviceFilter.toLowerCase()!=="all"){
    tempFilteredRequirements=tempFilteredRequirements.filter((eachItem)=>eachItem.category.toLowerCase()===serviceFilter.toLowerCase())
  }
  setFilteredRequirements(tempFilteredRequirements)

}

  // const filteredRequirements = requirements.filter((req) => {
  //   const matchesSearch =
  //     req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     req.description.toLowerCase().includes(searchTerm.toLowerCase())

  //   const matchesCategory = categoryFilter === "all" || req.category === categoryFilter

  //   const matchesBudget =
  //     budgetFilter === "all" ||
  //     (budgetFilter === "low" && req.budgetMax <= 2000) ||
  //     (budgetFilter === "medium" && req.budgetMax > 2000 && req.budgetMax <= 10000) ||
  //     (budgetFilter === "high" && req.budgetMax > 10000)

  //   return matchesSearch && matchesCategory && matchesBudget && req.status === "open"
  // })

  const canViewFullDetails = () => subscriptionTier !== "basic"

  const formatBudget = (min: number, max: number) =>
    `$${min.toLocaleString()} - $${max.toLocaleString()}`

  console.log("Receved prop requirements::::",requirements)

  return (
    <div className="space-y-8">

      {/* FILTER BAR */}
      <div className="border border-gray-200 rounded-4xl px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

          {/* Location */}
          <div className="flex flex-col gap-0 mt-0 leading-none">
            <span className="text-sm font-bold text-[#98A0B4]">
              Minimum Amount
            </span>

            {/* <Select
              value={searchTerm}
              onValueChange={(value) => setSearchTerm(value)}
            >
              <SelectTrigger
                  className="
                    h-12 rounded-xl border border-gray-300
                    focus:border-orange-500 focus:ring-0 flex items-center
                  "
                >
                {searchTerm ? (
                <span className="text-gray-700">{searchTerm}</span>
              ) : (
                <span className="text-gray-400 text-xs">Enter City/ State</span>
              )}
              </SelectTrigger>

              <SelectContent>
              
                
               
                <div className="p-2">
                  <Input
                    placeholder="Enter City/ State"
                    value={searchTerm}
                    autoFocus
                    onKeyDown={(e) => e.stopPropagation()}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 border border-gray-300 placeholder:text-gray-400 focus:border-orange-500 focus:ring-0"
                  />

                </div>

                {[
                  "Hyderabad",
                  "Bangalore",
                  "Chennai",
                  "Delhi",
                  "Mumbai",
                  "Pune",
                ]
                  .filter((city) =>
                    city.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>  */}

            <Input type="number" 
                value={searchTerm} 
                min={1}
                className="
                    h-12 rounded-xl border border-gray-300
                    focus:border-orange-500 focus:ring-0 flex items-center placeholder:text-gray-400
                  "
                  onChange={(e)=>(setSearchTerm(parseInt(e.target.value)))}
                  placeholder="Enter Your Project Minimum Amount"
                  />
          </div>

          {/* Technologies / Services */}
          <div className="flex flex-col gap-0">
            <span className="text-sm font-bold text-[#98A0B4]">
              Technologies/Services
            </span>

            {/* <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger
                className="
                  h-12 rounded-xl border border-gray-300
                  focus:border-orange-500 focus:ring-0
                  flex items-center
                "
              >
                {serviceFilter !== "all" ? (
                  <span className="text-gray-700">{serviceFilter}</span>
                ) : (
                  <span className="text-gray-400 text-xs">All Technologies</span>
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technologies</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            <ServiceDropdown
              value={serviceFilter}
              onChange={(value)=> setServiceFilter(value)}
              triggerClassName="
          h-12 rounded-xl border border-gray-300
          focus:border-orange-500 focus:ring-0
          flex items-center
          
        "
              />
          </div>

          {/* Minimum Rating */}
          {/* <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-[#98A0B4]">
              Minimum Rating
            </span>

            <Select
              value={ratingFilter}
              onValueChange={setRatingFilter}
            >
              <SelectTrigger
                className="
                  h-12 rounded-xl border border-gray-300
                  focus:border-orange-500 focus:ring-0
                  flex items-center
                "
              >
                {ratingFilter !== "any" ? (
                  <span className="text-gray-700">{ratingFilter}+</span>
                ) : (
                  <span className="text-gray-400 text-xs">Any Rating</span>
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Rating</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="1">1+</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Search Button */}
          <div className="flex items-end pt-6 gap-3">
            <Button className="px-8 py-4 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex gap-2"
            onClick={handleSearch}>
              <CiFilter 
              className="h-4 w-4"
              />
              Search
            </Button>
            <Button className="px-8 py-4 rounded-full bg-[#2C34A1] hover:bg-[#2C34A1] text-white flex gap-2"
            onClick={()=>{
              setServiceFilter("all");
              setSearchTerm(undefined)
              setFilteredRequirements(requirements);  // 🔥 THIS IS IMPORTANT
            }}>
              
              Clear
            </Button>
          </div>

        </div>
      </div>



      {/* SUBSCRIPTION WARNING */}
      {subscriptionTier === "basic" && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 flex items-center gap-3">
            <Lock className="h-5 w-5 text-yellow-600" />
            <div className="text-sm text-yellow-800">
              Upgrade your plan to view full project details and submit proposals.
            </div>
            <Button className="ml-auto">Upgrade Now</Button>
          </CardContent>
        </Card>
      )}

      {/* REQUIREMENTS LIST */}
      <div className="space-y-6">
        {filteredRequirements.map((req) => (
          <Card
          key={req._id}
          className="rounded-4xl border border-gray-200 bg-white"
        >
          <CardContent className="px-10 pb-8 space-y-7">

            {/* HEADER */}
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-2 max-w-[85%]">
                <h3 className="text-[22px] font-extrabold text-[#2c34a1]">
                  {req.title}
                </h3>

                <p className="text-[15px] text-[#898383]">
                  {canViewFullDetails()
                    ? req.description
                    : "Upgrade your subscription to view full project details."}
                </p>
              </div>

              {/* Category pill */}
              <span className="shrink-0 rounded-full bg-[#e0e0e0] px-4 py-2 text-xs font-medium">
                {req.category}
              </span>
            </div>

            {/* META ROW */}
            <div className="flex items-center gap-10 text-[15px] text-gray-800">

              {/* Budget */}
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orangeButton">
                  <AiOutlineDollar className="h-5 w-5 text-white" />
                </span>
                <span className="font-extrabold">
                  {canViewFullDetails()
                    ? formatBudget(req.budgetMin, req.budgetMax)
                    : "Budget hidden"} 
                </span>
              </div>

              {/* Duration (UI only) */}
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orangeButton">
                  <CiCalendar className="h-5 w-5 text-white" />
                </span>
                <span className="font-extrabold">{req.timeline}</span>
              </div>

              {/* Posted Date */}
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orangeButton">
                  <VscSend className="h-5 w-5 text-white" />
                </span>
                <span className="font-extrabold">
                  Posted:  {new Date(req.createdAt).toLocaleDateString()}
                </span>
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-5 pt-4">
              {/* <Button
                className="h-[50px] px-8 font-bold rounded-full bg-[#2c34a1] text-white hover:bg-indigo-700 flex items-center gap-2"
                onClick={() =>
                  router.push(`/agency/dashboard/project-inquiries/${req._id}`)
                }
              >
                View Details
                 <FaArrowRightLong className="text-sm" />
              </Button> */}

              <Button
                  className="h-[50px] px-8 font-bold rounded-full bg-black text-white hover:bg-black/90 flex items-center gap-2"
                  onClick={() =>
                  router.push(`/agency/dashboard/project-inquiries/${req._id}`)}
                >
                  Submit Proposal
                  <FaArrowRightLong className="text-sm" />
                </Button>

              {/* {canViewFullDetails() ? (
                <Button
                  className="h-[50px] px-8 font-bold rounded-full bg-black text-white hover:bg-black/90 flex items-center gap-2"
                  onClick={() => onSubmitProposal(req.id)}
                >
                  Submit Proposal
                  <FaArrowRightLong className="text-sm" />
                </Button>
              ) : (
                <Button
                  disabled
                  className="h-[46px] px-8 rounded-full"
                >
                  Upgrade to Submit
                </Button>
              )} */}
            </div>

          </CardContent>
        </Card>



        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredRequirements.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No requirements found matching your filters.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
