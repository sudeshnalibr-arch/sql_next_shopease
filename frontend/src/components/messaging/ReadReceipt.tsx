
type Props = {
  isOwnMessage: boolean;
  status: "sent" | "delivered" | "read";
};

export default function ReadReceipt({
  isOwnMessage,
  status,
}: Props) {
  if (!isOwnMessage) return null;

  return (
    <span
      className={`font-medium ${
        status === "read"
          ? "text-blue-200"
          : "text-orange-100"
      }`}
    >
      {status === "read"
        ? "✓✓ Read"
        : status === "delivered"
          ? "✓✓ Delivered"
          : "✓ Sent"}
    </span>
  );
}
