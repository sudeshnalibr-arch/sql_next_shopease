"use client";

import { useState } from "react";
import { useCreateReview } from "@/hooks/useReviews";

interface ReviewFormProps {
  productId: number;
  orderId: number;
}

export default function ReviewForm({
  productId,
  orderId,
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const createMutation = useCreateReview();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createMutation.mutate(
      {
        productId,
        orderId,
        rating,
        comment,
      },
      {
        onSuccess: () => {
          setComment("");
          setRating(5);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-5">
      <h3 className="text-lg font-semibold">Write a Review</h3>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Your Rating
        </label>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`text-2xl ${
                value <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
              aria-label={`Rate ${value} out of 5`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="review-comment" className="mb-2 block text-sm font-medium">
          Your Review
        </label>

        <textarea
          id="review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          required
          minLength={3}
          maxLength={1000}
          placeholder="Share your experience with this product..."
          className="w-full rounded-lg border p-3 outline-none focus:border-orange-500"
        />
      </div>

      {createMutation.isError && (
        <p className="text-sm text-red-600">
          Unable to submit your review. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={createMutation.isPending || !comment.trim()}
        className="rounded-lg bg-orange-600 px-6 py-3 text-white hover:bg-orange-700 disabled:opacity-50"
      >
        {createMutation.isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}