"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import type { Requirement } from "@/lib/types"

interface SubmitProposalFormProps {
  requirement: Requirement
  onSubmit: (proposal: any) => void
  onCancel: () => void
}

export function SubmitProposalForm({ requirement, onSubmit, onCancel }: SubmitProposalFormProps) {
  const [formData, setFormData] = useState({
    proposedCost: "",
    timeline: "",
    workApproach: "",
    milestones: [""],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      proposedCost: Number.parseInt(formData.proposedCost),
      milestones: formData.milestones.filter((m) => m.trim() !== ""),
    })
  }

  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, ""],
    }))
  }

  const updateMilestone = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => (i === index ? value : m)),
    }))
  }

  const removeMilestone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }))
  }

  const formatBudget = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Requirement Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Submitting Proposal For</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{requirement.title}</h3>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Badge variant="outline">{requirement.category}</Badge>
              <span>Budget: {formatBudget(requirement.budgetMin, requirement.budgetMax)}</span>
              <span>Timeline: {requirement.timeline}</span>
            </div>
            <p className="text-sm">{requirement.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Proposal Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Proposal</CardTitle>
          <CardDescription>Provide detailed information about your approach and pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proposedCost">Proposed Cost ($)</Label>
                <Input
                  id="proposedCost"
                  type="number"
                  value={formData.proposedCost}
                  onChange={(e) => setFormData((prev) => ({ ...prev, proposedCost: e.target.value }))}
                  placeholder="8500"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Client budget: {formatBudget(requirement.budgetMin, requirement.budgetMax)}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline">Estimated Timeline</Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, timeline: e.target.value }))}
                  placeholder="10 weeks"
                  required
                />
                <p className="text-xs text-muted-foreground">Client expectation: {requirement.timeline}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workApproach">Work Approach</Label>
              <Textarea
                id="workApproach"
                value={formData.workApproach}
                onChange={(e) => setFormData((prev) => ({ ...prev, workApproach: e.target.value }))}
                placeholder="Describe your methodology, technologies you'll use, and how you'll approach this project..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Project Milestones</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>

              <div className="space-y-2">
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={milestone}
                      onChange={(e) => updateMilestone(index, e.target.value)}
                      placeholder={`Milestone ${index + 1}`}
                      required={index === 0}
                    />
                    {formData.milestones.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeMilestone(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Proposal Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be specific about your approach and methodology</li>
                <li>• Highlight relevant experience and past projects</li>
                <li>• Break down your timeline into clear milestones</li>
                <li>• Explain why your pricing provides good value</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Submit Proposal
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
