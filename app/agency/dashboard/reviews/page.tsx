"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/auth-fetch";
import {
  Building2,
  FileText,
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  MessageSquare,
  Award,
  Edit,
  Settings,
  BarChart3,
  Users,
  Megaphone,
  CreditCard,
  Bell,
  UserPlus,
  ChevronDown,
  ChevronRight,
  Home,
  User,
  Briefcase,
  MessageCircle,
  FileSearch,
  Eye,
  GitCompare,
  Download,
  Phone,
  Video,
  Paperclip,
  Send,
  Mail,
  Clock,
  CheckCircle,
  X,
  Target,
  Handshake,
} from "lucide-react";
import {
  mockNotifications,
  mockProviderProjects,
  mockProviderReviews,
  mockRequirements,
} from "@/lib/mock-data";
import type {
  Provider,
  Requirement,
  Notification,
  Project,
  Review,
} from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import StarRating from "@/components/ui/star-rating";
import { MessageSquareText } from "lucide-react";
import RespondToReviewModal from "@/components/reviews/RespondToReviewModal";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [resLoading, setResLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setResLoading(true);
    try {
      const reviewRes = await authFetch("/api/reviews");
      const data = await reviewRes.json();

      console.log("Fetched the reviews::::", data);

      if (reviewRes.ok) {
        setReviews(data.reviews);
        setFailed(false);
      }
    } catch (error) {
      console.log("Failed to  fetch the data:::");
      setFailed(true);
    } finally {
      setResLoading(false);
    }
  };

  if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#F4561C] my-custom-class mb-0">
          Client Reviews
        </h1>
        <p className="text-[#656565] font-medium text-lg">
          View and respond to client feedback
        </p>
        <hr className="border-[#707070] mt-5 border-1 w-full" />
      </div>
      {/* REVIEWS LIST */}
      <div className="space-y-8 sm items-center">
        {reviews.length !== 0 &&
          reviews.map((review) => (
            <Card
              key={review._id}
              className="p-8 rounded-[28px] border-slate-300 shadow-none"
            >
              {/* TOP ROW */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[#0E0E0E]">
                    {review.client.name}
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
                {review.content}
              </p>

              {/* CATEGORY RATINGS */}
              <div
                className="flex flex-col sm:flex-row 
                        items-center sm:items-start 
                        justify-center sm:justify-start 
                        gap-6 sm:gap-20 mb-6 text-center sm:text-left"
              >
                <div>
                  <p className="text-sm text-center font-bold mb-1">Quality</p>
                  <StarRating
                    rating={review.qualityRating}
                    size={16}
                    showValue={false}
                  />
                </div>

                <div>
                  <p className="text-sm text-center font-bold mb-1">Cost</p>
                  <StarRating
                    rating={review.costRating}
                    size={16}
                    showValue={false}
                  />
                </div>

                <div>
                  <p className="text-sm text-center font-bold mb-1">
                    Timeliness
                  </p>
                  <StarRating
                    rating={review.scheduleRating}
                    size={16}
                    showValue={false}
                  />
                </div>
              </div>

              {/* ACTION */}
              {review.response && Object.keys(review.response).length === 0 && (
                <div className="flex justify-center sm:justify-start">
                  <button
                    onClick={() => {
                      setSelectedReview(review);
                      setIsModalOpen(true);
                    }}
                    className="flex w-fit items-center gap-2 px-4 py-2 text-sm rounded-full
                        border border-slate-400 text-[#FF4D00] hover:bg-[#FFF1EB]"
                  >
                    <MessageSquareText className="h-4 w-4" />
                    Respond to Review
                  </button>
                </div>
              )}
            </Card>
        ))}

        {reviews.length ===0 && (
          <p className="text-gray-500 text-center text-xl mt-5">No reviews have been received yet.</p>
        )}
        
      </div>

      {/* MODAL */}
      {isModalOpen && selectedReview && (
        <RespondToReviewModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          review={{
            clientName: selectedReview.client.name,
            date: new Date(selectedReview.createdAt).toLocaleDateString(),
            reviewText: selectedReview.content,
            quality: selectedReview.qualityRating,
            value: selectedReview.costRating,
            timeline: selectedReview.scheduleRating,
            id: selectedReview._id,
          }}
        />
      )}
    </div>
  );
};
export default ReviewsPage;
