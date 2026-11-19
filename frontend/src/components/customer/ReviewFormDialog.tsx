"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import type { CustomerReview } from "./ReviewCard";

interface ReviewFormDialogProps {
  open: boolean;
  review: CustomerReview | null;
  onClose: () => void;
  onSubmit: (payload: { rating: number; comment: string }) => void;
  isPending?: boolean;
}

export default function ReviewFormDialog({
  open,
  review,
  onClose,
  onSubmit,
  isPending = false,
}: ReviewFormDialogProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setRating(review?.rating ?? 5);
    setComment(review?.comment ?? "");
  }, [review, open]);

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ rating, comment });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-xl bg-white p-6"
      >
        <h2 className="text-xl font-bold text-gray-900">
          {review ? "Edit Review" : "Write a Review"}
        </h2>

        <div className="my-5">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Your Rating
          </p>

          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => {
              const value = index + 1;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`Rate ${value} stars`}
                >
                  <Star
                    size={27}
                    className={
                      value <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              );
            })}
          </div>
        </div>

        <textarea
          required
          minLength={3}
          rows={5}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share your experience with this product..."
          className="w-full rounded-lg border p-3 text-sm outline-none focus:border-orange-500"
        />

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
}