
"use client";

import AdminResourcePage from "@/components/admin/AdminResourcePage";

export default function ReportsPage() {
  return (
    <AdminResourcePage
      title="Reports"
      description="Review available business and operational reports."
      endpoint="/reports"
      searchPlaceholder="Search reports..."
      columns={[
        { key: "id", label: "Report ID" },
        { key: "name", label: "Report Name" },
        {
          key: "type",
          label: "Report Type",
          render: (value) => (
            <span className="capitalize">{String(value ?? "—")}</span>
          ),
        },
        {
          key: "status",
          label: "Status",
          render: (value) => (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
              {String(value ?? "Available")}
            </span>
          ),
        },
        {
          key: "createdAt",
          label: "Generated",
          render: (value) =>
            value
              ? new Date(String(value)).toLocaleDateString("en-IN")
              : "—",
        },
      ]}
    />
  );
}
