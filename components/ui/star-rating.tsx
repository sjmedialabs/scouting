"use client"

import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  reviews?: number
  size?: number
  showValue?: boolean
}

export default function StarRating({
  rating,
  reviews,
  size = 16,
  showValue =true,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const fillValue = rating - i
          let fillColor = "#E2E2E2"

          if (fillValue >= 1) fillColor = "#FFB400"

          if (fillValue > 0 && fillValue < 1) {
            return (
              <div
                key={i}
                className="relative"
                style={{
                  width: size,
                  height: size,
                  WebkitMask:
                    "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22black%22%3E%3Cpath d=%22M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.264L12 18.897l-7.417 4.637L6 15.27 0 9.423l8.332-1.268z%22/%3E%3C/svg%3E') center / contain no-repeat",
                  background: `linear-gradient(90deg, #FFB400 ${
                    fillValue * 100
                  }%, #E2E2E2 ${fillValue * 100}%)`,
                }}
              />
            )
          }

          return (
            <Star
              key={i}
              width={size}
              height={size}
              fill={fillColor}
              stroke="none"
            />
          )
        })}
      </div>

      {/* Rating number */}
      {showValue && (
  <span className="text-sm font-semibold ml-2">
    {rating.toFixed(1)}
  </span>
)}

      {/* Reviews count */}
      {reviews !== undefined && (
        <span className="text-[14px] text-[#7C7C7C]">
          ({reviews})
        </span>
      )}
    </div>
  )
}
