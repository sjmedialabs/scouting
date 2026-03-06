"use client";

import { X, Loader2, CheckCircle } from "lucide-react";
import { Content } from "next/font/google";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";

interface RespondToReviewModalProps {
  open: boolean;
  onClose: () => void;
  review: {
    clientName: string;
    date: string;
    reviewText: string;
    quality: number;
    value: number;
    timeline: number;
    id: string;
  };
}

export default function RespondToReviewModal({
  open,
  onClose,
  review,
}: RespondToReviewModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /* ---- stop background scroll ---- */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);

    console.log("Submitting");
    if (!message.trim()) {
      console.log("entered if");
      setErrorMsg("*Required");
      return;
    }

    try {
      const res = await authFetch(`/api/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message }),
      });

      console.log("Respond to review status:::", res);

      if (res.ok) {
        setShowToast(true);
        setMessage("");
        setTimeout(() => {
          (setShowToast(false), window.location.reload());
        }, 5000);
      }
    } catch (error) {
      console.log("Failed to post the response:::", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-60 flex items-center gap-2 bg-black text-white px-4 py-3 rounded-xl shadow-lg">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className="text-sm font-medium">
            Response submitted successfully
          </span>
        </div>
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
          onClick={!isSubmitting ? onClose : undefined}
        />

        {/* Modal */}
        <div
          className="
            relative bg-white
            w-full max-w-[640px]
            mx-4 rounded-3xl
            shadow-2xl
            max-h-[90vh] overflow-y-auto
          "
        >
          {/* Header */}
          <div className="relative px-6 py-5">
            <h2 className="w-full text-center text-sm h-0 font-semibold">
              Respond to Review
            </h2>

            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute right-4 top-4 text-gray-500 hover:text-black disabled:opacity-40"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Review Summary */}
          <div className="p-6 bg-[#f7f7f7] rounded-2xl mx-6 mt-6">
            <h3 className="text-base font-extrabold">{review.clientName}</h3>

            <p className="text-xs text-gray-400 mt-0">{review.date}</p>

            <p className="text-xs text-gray-600 mt-0 leading-relaxed">
              {review.reviewText}
            </p>

            {/* Ratings */}
            <div className="grid grid-cols-3 gap-6 mt-3 text-center text-sm">
              <RatingBlock label="Quality" value={review.quality} />
              <RatingBlock label="Value" value={review.value} />
              <RatingBlock label="Timeliness" value={review.timeline} />
            </div>
          </div>

          {/* Response */}
          <div className="px-6 mt-8">
            <h4 className="text-sm font-semibold mb-2 text-center">
              Your Response
            </h4>

            <textarea
              placeholder="Thank you for your feedback. We appreciate your business and..."
              disabled={isSubmitting}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="
                w-full h-40
                border border-[#e5e5e5]
                rounded-2xl
                p-4 text-sm
                placeholder:text-[#b5b5b5]
                resize-none
                focus:outline-none
                disabled:bg-[#f2f2f2]
              "
            />
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 px-6 pb-6 mt-8">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="
                flex-1 h-10 px-3
                rounded-full
                bg-[#F54A0C]
                text-white
                font-semibold
                transition-all duration-200
                hover:bg-[#e1440a]
                active:scale-95
                active:bg-[#cc3d09]
                disabled:opacity-60
                disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Response"
              )}
            </button>

            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="
                flex-1 h-10 px-3
                rounded-full
                bg-black
                text-white
                font-semibold
                transition-all duration-200
                hover:bg-[#2a2a2a]
                active:scale-95
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function RatingBlock({ label, value }: { label: string; value: number }) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm font-semibold text-black mb-1">
        {label}: {value}/5
      </p>

      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < fullStars) {
            return (
              <span key={i} className="text-[#F5A623] text-sm">
                ★
              </span>
            );
          }

          if (i === fullStars && hasHalfStar) {
            return (
              <span key={i} className="relative text-sm text-[#D9D9D9]">
                ★
                <span
                  className="
                    absolute left-0 top-0
                    overflow-hidden
                    w-1/2
                    text-[#F5A623]
                  "
                >
                  ★
                </span>
              </span>
            );
          }

          return (
            <span key={i} className="text-[#D9D9D9] text-sm">
              ★
            </span>
          );
        })}
      </div>
    </div>
  );
}
