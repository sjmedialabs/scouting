"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { Provider } from "@/lib/types"

interface EditProfileModalProps {
  provider: Provider
  isOpen: boolean
  onClose: () => void
  onSave: (updatedProvider: Provider) => void
}

export function EditProfileModal({ provider, isOpen, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    companyName: provider.companyName,
    description: provider.description,
    location: provider.location,
    foundedYear: provider.foundedYear,
    hourlyRate: provider.hourlyRate,
    services: [...provider.services],
    newService: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedProvider: Provider = {
      ...provider,
      companyName: formData.companyName,
      description: formData.description,
      location: formData.location,
      foundedYear: formData.foundedYear,
      hourlyRate: formData.hourlyRate,
      services: formData.services,
    }
    onSave(updatedProvider)
    onClose()
  }

  const addService = () => {
    if (formData.newService.trim()) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, prev.newService.trim()],
        newService: "",
      }))
    }
  }

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Company Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="foundedYear">Founded Year</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    value={formData.foundedYear}
                    onChange={(e) => setFormData((prev) => ({ ...prev, foundedYear: Number.parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hourlyRate: Number.parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px]"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Services Offered</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.services.map((service, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {service}
                    <button type="button" onClick={() => removeService(index)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add new service..."
                  value={formData.newService}
                  onChange={(e) => setFormData((prev) => ({ ...prev, newService: e.target.value }))}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
                />
                <Button type="button" onClick={addService} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
