"use client"

import { useState } from "react"
import RespondToReviewModal from "@/components/reviews/RespondToReviewModal"

export default function RespondClient() {
  const [open, setOpen] = useState(true) 

  return (
    <RespondToReviewModal
      open={open}
      onClose={() => setOpen(false)}
      review={{
        clientName: "Anonymous Client",
        date: "January 10, 2024",
        reviewText:
          "Excellent work! The team delivered exactly what we needed...",
        quality: 4.5,
        value: 4.5,
        timeline: 4.5,
      }}
    />
  )
}
