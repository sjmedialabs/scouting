"use client"

import type React from "react"

import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import { categories } from "@/lib/mock-data"
import FileUpload from "../file-upload"
import PdfUpload from "../pdfUpload"
import { toast } from "@/lib/toast"
import ServiceDropdown from "../select-category-filter"

interface PostRequirementFormProps {
  onSubmit: (requirement: any) => void
  sendingStatus:boolean
  
}

export function PostRequirementForm({ onSubmit,sendingStatus}: PostRequirementFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    category: "",
    budgetMin: "",
    budgetMax: "",
    documentUrl:"",
    timeline: "",
  })
  
   // ✅ RESET FORM ONLY WHEN sendingStatus CHANGES TO TRUE
  useEffect(() => {
    if (sendingStatus) {
      setFormData({
        title: "",
        image: "",
        description: "",
        category: "",
        budgetMin: "",
        budgetMax: "",
        documentUrl: "",
        timeline: "",
      })
    }
  }, [sendingStatus])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if(!formData.title.trim() || !formData.category || !formData.description.trim() || !formData.budgetMin.trim() || !formData.budgetMax.trim()){
      toast.error("All Fields are required except document")
      return
    }
    if(Number(formData.budgetMin)>Number(formData.budgetMax)){
      toast.error("Minimum budget should be greater than the Maximum budget")
      return
    }

    //Build correct payload for API
    const payload = {
      title: formData.title.trim(),
      image: formData.image,
      category: formData.category,
      description: formData.description.trim(),
      budgetMin: Number(formData.budgetMin),
      budgetMax: Number(formData.budgetMax),
      documentUrl:formData.documentUrl,
      timeline: formData.timeline.trim(),
    }

    onSubmit(payload)
    // console.log("Requirement submitted:", formData)
  }

  console.log("Form Data :::::;",formData)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="my-custom-class">
      <div className="max-w-2xl bg-[#fff]">
      
        <h1 className="text-3xl text-[#F54A0C] font-bold tracking-tight">Post New Requirement</h1>
        <p className="text-xl text-[#656565] font-light mb-8">Describe your project needs to receive proposals from qualified providers</p>
      
      <div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#98A0B4] text-[14px] font-normal">Project Title</Label>
            <Input
              id="title" 
              value={formData.title}
              className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
            
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., E-commerce Website Development"
              required
            />
          </div>
          {/*categories */}
          {/* <div className="space-y-2">
            <Label htmlFor="category" className="text-[#98A0B4] text-[14px] font-normal">Category</Label>
           <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger
              className="
                border-2 border-[#D0D5DD] rounded-[8px]
                data-[placeholder]:text-[#98A0B4]
                
                text-[#000]
              "
            >
              <SelectValue placeholder="Select a category" style={{color:"#98A0B4"}} />
            </SelectTrigger>

            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          </div> */}

           <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-[#000]  text-[14px] font-bold"
                ></Label>

                <ServiceDropdown
                value={formData.category}
                  onChange={(value)=> setFormData((prev) => ({ ...prev, category: value }))}
                  triggerClassName="border-2 border-[#D0D5DD] rounded-[8px] data-[placeholder]:text-[#98A0B4] text-[#000] p-4"
                />
          </div>
          

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#98A0B4] text-[14px] font-normal">Project Description</Label>
            <Textarea
              id="description"
              className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide detailed information about your project requirements, goals, and expectations..."
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin" className="text-[#98A0B4] text-[14px] font-normal">Budget Range (Min)</Label>
              <Input
                id="budgetMin"
                type="number"
                value={formData.budgetMin}
                className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                onChange={(e) => setFormData((prev) => ({ ...prev, budgetMin: e.target.value }))}
                placeholder="1000"
                required
              />
            </div>
            <div className="space-y-2"  >
              <Label htmlFor="budgetMax" className="text-[#98A0B4] text-[14px] font-normal">Budget Range (Max)</Label>
              <Input
                id="budgetMax"
                type="number"
                value={formData.budgetMax}
                className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                onChange={(e) => setFormData((prev) => ({ ...prev, budgetMax: e.target.value }))}
                placeholder="5000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline" className="text-[#98A0B4] text-[14px] font-normal">Expected Timeline</Label>
            <Input
              id="timeline"
              value={formData.timeline}
               className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
              onChange={(e) => setFormData((prev) => ({ ...prev, timeline: e.target.value }))}
              placeholder="e.g., 3 months, 8 weeks"
              required
            />
          </div>
          <div className="space-y-2">
           <Label className="text-[#98A0B4] text-[14px] font-normal">Project Attachment (optional)</Label>
           <PdfUpload
        maxSizeMB={10}
        onUploadSuccess={(url) =>
          setFormData((prev) => ({
            ...prev,
            documentUrl: url,
          }))
        }
      />
          </div>
          


          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Post Requirement
            </Button>
            
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}
