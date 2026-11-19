import { Star, Pencil, Trash2 } from "lucide-react";

export interface CustomerReview {
  id: number;
  productId: number;
  productName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

interface ReviewCardProps {
  review: CustomerReview;
  onEdit: (review: CustomerReview) => void;
  onDelete: (id: number) => void;
}

export default function ReviewCard({
  review,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  return (
    <article className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            {review.productName}
          </h3>

          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={16}
                className={
                  index < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
        </div>

        {review.isVerifiedPurchase && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Verified Purchase
          </span>
        )}
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-600">
        {review.comment}
      </p>

      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <p className="text-xs text-gray-400">
          {new Date(review.createdAt).toLocaleDateString("en-IN")}
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => onEdit(review)}
            className="flex items-center gap-1 text-sm text-blue-600"
          >
            <Pencil size={15} /> Edit
          </button>

          <button
            onClick={() => onDelete(review.id)}
            className="flex items-center gap-1 text-sm text-red-600"
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>
    </article>
  );
}