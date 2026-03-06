"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, Flag } from "lucide-react"
import type { Review } from "@/lib/types"

interface ReviewManagementProps {
  reviews: Review[]
  onRespond: (reviewId: string, response: string) => void
  onReport: (reviewId: string, reason: string) => void
}

export function ReviewManagement({ reviews, onRespond, onReport }: ReviewManagementProps) {
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [showResponseForm, setShowResponseForm] = useState<string | null>(null)

  const handleSubmitResponse = (reviewId: string) => {
    const response = responses[reviewId]
    if (response?.trim()) {
      onRespond(reviewId, response.trim())
      setResponses((prev) => ({ ...prev, [reviewId]: "" }))
      setShowResponseForm(null)
    }
  }

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  )

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No reviews to manage</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Client Review</CardTitle>
                <CardDescription>Project completed on {formatDate(review.createdAt)}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} />
                <Badge variant="secondary">{review.rating}.0</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">{review.comment}</p>

            <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium mb-1">Quality</p>
                <StarRating rating={review.qualityRating} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium mb-1">Value</p>
                <StarRating rating={review.costRating} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium mb-1">Timeliness</p>
                <StarRating rating={review.timelinessRating} />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResponseForm(showResponseForm === review.id ? null : review.id)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {showResponseForm === review.id ? "Cancel" : "Respond"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => onReport(review.id, "inappropriate")}>
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>

            {showResponseForm === review.id && (
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border">
                <Textarea
                  placeholder="Write a professional response to this review..."
                  value={responses[review.id] || ""}
                  onChange={(e) =>
                    setResponses((prev) => ({
                      ...prev,
                      [review.id]: e.target.value,
                    }))
                  }
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitResponse(review.id)}
                    disabled={!responses[review.id]?.trim()}
                  >
                    Submit Response
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowResponseForm(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
