import type { Review } from "../review.types";
import ReviewCard from "./ReviewCard";

interface Props {
  reviews: Review[];
}

export default function ReviewList({ reviews }: Props) {
  if (reviews.length === 0) {
    return (
      <p className="py-6 text-gray-500">
        No reviews yet. Be the first to review this product.
      </p>
    );
  }

  return (
    <div>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}