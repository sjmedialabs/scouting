import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"
import type { Review } from "@/lib/types"

interface ReviewSummaryProps {
  reviews: Review[]
}

export function ReviewSummary({ reviews }: ReviewSummaryProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No reviews available</p>
        </CardContent>
      </Card>
    )
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const averageQuality = reviews.reduce((sum, review) => sum + review.qualityRating, 0) / reviews.length
  const averageCost = reviews.reduce((sum, review) => sum + review.costRating, 0) / reviews.length
  const averageTimeliness = reviews.reduce((sum, review) => sum + review.timelinessRating, 0) / reviews.length

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage: (reviews.filter((review) => review.rating === rating).length / reviews.length) * 100,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground">
            Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm w-8">{rating} ★</span>
              <Progress value={percentage} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground w-8">{count}</span>
            </div>
          ))}
        </div>

        {/* Category Averages */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{averageQuality.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Quality</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{averageCost.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Value</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{averageTimeliness.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Timeliness</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
