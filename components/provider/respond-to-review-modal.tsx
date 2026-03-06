"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { Review } from "@/lib/types"

interface RespondToReviewModalProps {
  review: Review | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (reviewId: string, response: string) => void
}

export function RespondToReviewModal({ review, isOpen, onClose, onSubmit }: RespondToReviewModalProps) {
  const [response, setResponse] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (review && response.trim()) {
      onSubmit(review.id, response.trim())
      setResponse("")
      onClose()
    }
  }

  console.log("[v0] RespondToReviewModal rendering - isOpen:", isOpen, "review ID:", review?.id)
  console.log("[v0] Modal Dialog open prop:", isOpen)

  if (!review) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Respond to Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.rating}/5</span>
                </div>
                <span className="text-sm text-muted-foreground">{review.createdAt.toLocaleDateString()}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                <div>Quality: {review.qualityRating}/5</div>
                <div>Cost: {review.costRating}/5</div>
                <div>Timeliness: {review.timelinessRating}/5</div>
              </div>

              <p className="text-sm bg-muted p-3 rounded-md">{review.comment}</p>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="response">Your Response</Label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Thank you for your feedback. We appreciate your business and..."
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={!response.trim()}>
                Submit Response
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
