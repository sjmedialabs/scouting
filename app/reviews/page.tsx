"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import RespondToReviewModal from "@/components/reviews/RespondToReviewModal"
import { mockProviderReviews } from "@/lib/mock-data"
import { toast } from "@/hooks/use-toast"
import type { Review } from "@/lib/types"
import StarRating from "@/components/ui/star-rating"
import { MessageSquareText } from "lucide-react"


export default function ReviewsPage() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  

  const handleSubmitResponse = () => {
    toast({
      title: "Response Submitted",
      description: "Your response has been submitted successfully.",
    })
  }

  const ratingCounts = {
    5: 57,
    4: 102,
    3: 86,
    2: 32,
    1: 27,
  }

  return (
    <div className="bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <p className="text-[#ff4d00] font-medium mb-1">Reviews & Ratings</p>
          <h1 className="text-2xl sm:text-3xl font-medium">
            See what clients are saying about our service providers
          </h1>
        </div>

        {/* REVIEW SUMMARY */}
        <div className="flex justify-center mb-12">
          <Card className="w-full max-w-5xl p-6 rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1px_1fr] lg:grid-cols-[320px_1px_1fr] gap-6 items-center w-full">

              {/* LEFT */}
              <div className="flex flex-col justify-center pr-0 md:pr-4 text-center md:text-left">
              <span className="text-[16px] font-medium text-[#FF4D00] mb-1">
                Review Summary
              </span>

              <div className="flex items-center gap-2 leading-none">
               <span className="text-[50px] font-extrabold text-[#FF4D00] leading-none">
                 4.2
               </span>

                <div className="flex items-center gap-1">
                 {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                     key={i}
                     viewBox="0 0 24 24"
                     className={`h-[25px] w-[25px] ${
                       i <= 4.2 ? "fill-[#FFB400]" : "fill-[#E5E5E5]"
                     }`}
                    >
                      <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.264L12 18.897l-7.417 4.637L6 15.27 0 9.423l8.332-1.268z" />
                    </svg>
                  ))}
                </div>
              </div>

              <span className="mt-2 text-[18px] text">
                (Based on 357 Reviews)
              </span>
            </div>

              {/* DIVIDER */}
              <div className="hidden h-[130px] md:block w-px bg-[#D6D6D8] lg:mx-30" 
              aria-hidden 
              />

              {/* RIGHT */}
              <div className="space-y-2 w-full max-w-sm lg:ml-auto">
                {Object.entries(ratingCounts)
                  .reverse()
                  .map(([star, count]) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm text-[#ff4d00] w-6">{star} ★</span>

                      <div className="flex-1 h-2 bg-[#bbbbbb] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#616161] rounded-full"
                          style={{ width: `${(count / 357) * 100}%` }}
                        />
                      </div>

                      <span className="text-sm text-muted-foreground w-8 text-right">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>

            </div>
          </Card>
        </div>

        {/* REVIEWS LIST */}
        <div className="space-y-8 sm items-center">
  {mockProviderReviews.map((review) => (
    <Card
      key={review.id}
      className="p-8 rounded-[28px] border-slate-300 shadow-none"
    >
      {/* TOP ROW */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#0E0E0E]">
            Anonymous Client
          </h3>
          <p className="text-sm text-[#9B9B9B]">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Rating badge */}
        <div className="flex items-center w-fit gap-2 px-3 py-1 border rounded-lg">
          <span className="text-sm font-semibold text-[#6B6B6B]">
            {review.rating.toFixed(1)}
          </span>
          <StarRating rating={review.rating} showValue={false} />
        </div>
      </div>

      {/* COMMENT */}
      <p className="text-sm sm:justify-items-center text-[#8B8B8B] leading-relaxed max-w-5xl mb-6">
        {review.comment}
      </p>

      {/* CATEGORY RATINGS */}
      <div className="flex flex-col sm:flex-row 
                items-center sm:items-start 
                justify-center sm:justify-start 
                gap-6 sm:gap-20 mb-6 text-center sm:text-left">
        <div>
          <p className="text-sm text-center font-bold mb-1">Quality</p>
          <StarRating rating={review.rating} size={16} showValue={false} />
        </div>

        <div>
          <p className="text-sm text-center font-bold mb-1">Value</p>
          <StarRating rating={review.rating} size={16} showValue={false} />
        </div>

        <div>
          <p className="text-sm text-center font-bold mb-1">Timeliness</p>
          <StarRating rating={review.rating } size={16} showValue={false} />
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-center sm:justify-start">
      <button
        onClick={() => {
      setSelectedReview(review)
      setIsModalOpen(true)
    }}
    className="flex w-fit items-center gap-2 px-4 py-2 text-sm rounded-full
               border border-slate-400 text-[#FF4D00] hover:bg-[#FFF1EB]"
  >
    <MessageSquareText className="h-4 w-4" />
    Respond to Review
  </button>
</div>
    </Card>
  ))}
</div>
      </div>

      {/* MODAL */}
      {isModalOpen && selectedReview && (
      <RespondToReviewModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        review={{
          clientName: "Anonymous Client",
          date: new Date(selectedReview.createdAt).toLocaleDateString(),
          reviewText: selectedReview.comment,
          quality: selectedReview.rating,
          value: selectedReview.rating,
          timeline: selectedReview.rating,
        }}
      />
    )}
    </div>
  )
}

