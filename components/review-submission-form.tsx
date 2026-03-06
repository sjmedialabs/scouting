"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

interface ReviewSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reviewData: any) => void
  providerId: string
  providerName: string
}

export function ReviewSubmissionForm({
  isOpen,
  onClose,
  onSubmit,
  providerId,
  providerName,
}: ReviewSubmissionFormProps) {
  const [ratings, setRatings] = useState({
    overall: 0,
    quality: 0,
    cost: 0,
    timeliness: 0,
  })
  const [comment, setComment] = useState("")

  const handleRatingChange = (category: keyof typeof ratings, rating: number) => {
    setRatings((prev) => ({ ...prev, [category]: rating }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      providerId,
      ...ratings,
      comment,
      createdAt: new Date(),
    })
    onClose()
  }

  const RatingStars = ({ category, value }: { category: keyof typeof ratings; value: number }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRatingChange(category, star)}
          className="focus:outline-none"
        >
          <Star className={`h-5 w-5 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        </button>
      ))}
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review & Rate {providerName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rate Your Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Overall Rating</Label>
                  <RatingStars category="overall" value={ratings.overall} />
                </div>
                <div>
                  <Label>Quality of Work</Label>
                  <RatingStars category="quality" value={ratings.quality} />
                </div>
                <div>
                  <Label>Value for Money</Label>
                  <RatingStars category="cost" value={ratings.cost} />
                </div>
                <div>
                  <Label>Timeliness</Label>
                  <RatingStars category="timeliness" value={ratings.timeliness} />
                </div>
              </div>

              <div>
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience working with this provider..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={ratings.overall === 0}>
              Submit Review
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
