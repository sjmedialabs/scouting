"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

interface ReviewFormProps {
  projectId: string
  providerName: string
  onSubmit: (review: ReviewData) => void
}

interface ReviewData {
  rating: number
  qualityRating: number
  costRating: number
  timelinessRating: number
  comment: string
}

export function ReviewForm({ projectId, providerName, onSubmit }: ReviewFormProps) {
  const [ratings, setRatings] = useState({
    overall: 0,
    quality: 0,
    cost: 0,
    timeliness: 0,
  })
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const StarRating = ({
    value,
    onChange,
    label,
  }: {
    value: number
    onChange: (rating: number) => void
    label: string
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const reviewData: ReviewData = {
      rating: ratings.overall,
      qualityRating: ratings.quality,
      costRating: ratings.cost,
      timelinessRating: ratings.timeliness,
      comment,
    }

    try {
      await onSubmit(reviewData)
      // Reset form
      setRatings({ overall: 0, quality: 0, cost: 0, timeliness: 0 })
      setComment("")
    } catch (error) {
      console.error("Failed to submit review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    ratings.overall > 0 &&
    ratings.quality > 0 &&
    ratings.cost > 0 &&
    ratings.timeliness > 0 &&
    comment.trim().length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
        <CardDescription>Share your experience working with {providerName}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <StarRating
              value={ratings.overall}
              onChange={(rating) => setRatings((prev) => ({ ...prev, overall: rating }))}
              label="Overall Rating"
            />
            <StarRating
              value={ratings.quality}
              onChange={(rating) => setRatings((prev) => ({ ...prev, quality: rating }))}
              label="Quality of Work"
            />
            <StarRating
              value={ratings.cost}
              onChange={(rating) => setRatings((prev) => ({ ...prev, cost: rating }))}
              label="Value for Money"
            />
            <StarRating
              value={ratings.timeliness}
              onChange={(rating) => setRatings((prev) => ({ ...prev, timeliness: rating }))}
              label="Timeliness"
            />
          </div>

          <div>
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Share details about your experience, what went well, and any areas for improvement..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">{comment.length}/500 characters</p>
          </div>

          <Button type="submit" className="w-full" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
