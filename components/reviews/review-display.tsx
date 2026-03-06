"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, User, MessageSquare } from "lucide-react"
import type { Review } from "@/lib/types"

interface ReviewDisplayProps {
  reviews: Review[]
  showProviderResponse?: boolean
  onRespondClick?: (review: Review) => void // Added respond callback prop
}

export function ReviewDisplay({ reviews, showProviderResponse = false, onRespondClick }: ReviewDisplayProps) {
  const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size === "lg" ? "h-5 w-5" : "h-4 w-4"} ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No reviews yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Anonymous Client</p>
                  <p className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} size="lg" />
                <Badge variant="secondary">{review.rating}.0</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 leading-relaxed">{review.comment}</p>

            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg mb-4">
              <div className="text-center">
                <p className="text-sm font-medium mb-1">Quality</p>
                <div className="flex justify-center">
                  <StarRating rating={review.qualityRating} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium mb-1">Value</p>
                <div className="flex justify-center">
                  <StarRating rating={review.costRating} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium mb-1">Timeliness</p>
                <div className="flex justify-center">
                  <StarRating rating={review.timelinessRating} />
                </div>
              </div>
            </div>

            {onRespondClick && (
              <div className="mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log("[v0] Respond button clicked for review:", review.id)
                    console.log("[v0] onRespondClick function:", typeof onRespondClick)
                    onRespondClick(review)
                  }}
                  className="gap-2"
                  type="button"
                >
                  <MessageSquare className="h-4 w-4" />
                  Respond to Review
                </Button>
              </div>
            )}

            {showProviderResponse && (
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-200 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-sm font-medium text-blue-900">Provider Response</p>
                </div>
                <p className="text-sm text-blue-800">
                  Thank you for the wonderful review! We're glad we could deliver exactly what you needed. Looking
                  forward to working with you again in the future.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
