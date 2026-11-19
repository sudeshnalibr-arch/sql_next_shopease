"use client";

import { useState } from "react";
import CustomerPageHeader from "@/components/customer/CustomerPageHeader";
import ReviewCard from "@/components/customer/ReviewCard";
import ReviewFormDialog from "@/components/customer/ReviewFormDialog";

import type { CustomerReview } from "@/components/customer/ReviewCard";

import api from "@/lib/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ReviewsResponse {
  success: boolean;
  message: string;
  data: CustomerReview[];
}

export default function CustomerReviewsPage() {
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] =
    useState<CustomerReview | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["customer-reviews"],
    queryFn: async () => {
      const response = await api.get<ReviewsResponse>(
        "/reviews/my-reviews"
      );

      return response.data.data;
    },
  });

  const updateReview = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: { rating: number; comment: string };
    }) => {
      await api.patch(`/reviews/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer-reviews"],
      });
      setDialogOpen(false);
    },
  });

  const deleteReview = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/reviews/${id}`);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["customer-reviews"],
      }),
  });

  if (isLoading) {
    return <p className="text-gray-500">Loading reviews...</p>;
  }

  if (isError) {
    return <p className="text-red-600">Unable to load reviews.</p>;
  }

  const handleEdit = (review: CustomerReview) => {
    setSelectedReview(review);
    setDialogOpen(true);
  };

  return (
    <div>
      <CustomerPageHeader
        title="My Reviews"
        description="Manage the product reviews you have submitted."
      />

      {!data?.length ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <h2 className="font-semibold text-gray-900">
            You haven't written any reviews.
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Share your experience after purchasing a product.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {data.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={handleEdit}
              onDelete={(id) => {
                if (window.confirm("Delete this review?")) {
                  deleteReview.mutate(id);
                }
              }}
            />
          ))}
        </div>
      )}

      <ReviewFormDialog
        open={dialogOpen}
        review={selectedReview}
        onClose={() => {
          setDialogOpen(false);
          setSelectedReview(null);
        }}
        onSubmit={(payload) => {
          if (selectedReview) {
            updateReview.mutate({
              id: selectedReview.id,
              payload,
            });
          }
        }}
        isPending={updateReview.isPending}
      />

      {(updateReview.isError || deleteReview.isError) && (
        <p className="mt-4 text-sm text-red-600">
          Unable to complete the review operation.
        </p>
      )}
    </div>
  );
}