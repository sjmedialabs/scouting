"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, DollarSign, FileText, MapPin, Tag } from "lucide-react"
import type { Requirement } from "@/lib/types"

interface RequirementDetailsModalProps {
  requirement: Requirement | null
  isOpen: boolean
  onClose: () => void
  onViewProposals: (requirementId: string) => void
}

export function RequirementDetailsModal({
  requirement,
  isOpen,
  onClose,
  onViewProposals,
}: RequirementDetailsModalProps) {
  if (!requirement) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "shortlisted":
        return "bg-blue-100 text-blue-800"
      case "negotiation":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl">{requirement.title}</DialogTitle>
              <DialogDescription className="mt-2">
                Posted on {requirement.createdAt.toLocaleDateString()}
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(requirement.status)}>
              {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Category: {requirement.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Budget: ${requirement.budgetMin.toLocaleString()} - ${requirement.budgetMax.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Timeline: {requirement.timeline}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Location: {requirement.location || "Remote"}</span>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{requirement.description}</p>
          </div>

          {/* Skills Required */}
          {requirement.skillsRequired && requirement.skillsRequired.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Skills Required</h4>
              <div className="flex flex-wrap gap-2">
                {requirement.skillsRequired.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {requirement.attachments && requirement.attachments.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Attachments</h4>
              <div className="space-y-2">
                {requirement.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{attachment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={() => onViewProposals(requirement.id)}>View Proposals</Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
