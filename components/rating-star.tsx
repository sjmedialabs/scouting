"use client";

import React from "react";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";

interface RatingStarsProps {
  rating: number | string;
  reviews?: number | string;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, reviews }) => {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));

  const full = Math.floor(value);
  const hasHalf = value % 1 !== 0;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {/* FULL STARS */}
      {Array.from({ length: full }).map((_, i) => (
        <IoIosStar key={`full-${i}`} size={20} className="text-yellow-500" />
      ))}

      {/* HALF STAR */}
      {hasHalf && (
        <IoIosStarHalf size={20} className="text-yellow-500" />
      )}

      {/* EMPTY STARS */}
      {Array.from({ length: empty }).map((_, i) => (
        <IoIosStar key={`empty-${i}`} size={20} className="text-gray-300" />
      ))}

      {/* RATING TEXT */}
      {/* <span className="ml-1 text-sm text-gray-700">{value.toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="text-sm text-gray-500"> ({reviews})</span>
      )} */}
    </div>
  );
};

export default RatingStars;
