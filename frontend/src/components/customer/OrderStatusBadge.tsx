interface OrderStatusBadgeProps {
  status: string;
}

const styles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-green-100 text-green-700",
};

export default function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  const normalized = status.toLowerCase();

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[normalized] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}