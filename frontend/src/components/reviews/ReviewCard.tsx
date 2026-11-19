import type { Review } from "../review.types";
import RatingStars from "./RatingStars";

interface Props {
  review: Review;
}

export default function ReviewCard({ review }: Props) {
  return (
    <article className="border-b py-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">
          {review.user?.name ?? "Customer"}
        </h3>

        <RatingStars rating={review.rating} />
      </div>

      {review.isVerifiedPurchase && (
        <p className="mt-1 text-xs text-green-600">
          Verified Purchase
        </p>
      )}

      <p className="mt-3 text-gray-600">
        {review.comment}
      </p>

      <p className="mt-3 text-xs text-gray-400">
        {new Date(review.createdAt).toLocaleDateString("en-IN")}
      </p>
    </article>
  );
}