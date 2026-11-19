"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  useCustomerOrder,
} from "@/features/customers/orders/order.queries";

import OrderDetailsCard from "@/components/customer/OrderDetailsCard";

export default function CustomerOrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isLoading, isError } = useCustomerOrder(id);

  if (isLoading) {
    return <p className="text-gray-500">Loading order details...</p>;
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600">
        Unable to load this order. It may not exist or may not belong to your account.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/customer/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-orange-600"
      >
        <ArrowLeft size={17} />
        Back to Orders
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">
        Order Details
      </h1>

      <OrderDetailsCard order={data} />
    </div>
  );
}