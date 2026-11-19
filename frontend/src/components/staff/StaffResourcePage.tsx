"use client";

import AdminResourcePage from "@/components/admin/AdminResourcePage";

interface StaffResourcePageProps {
  title: string;
  description: string;
  endpoint: string;
  searchPlaceholder?: string;
  columns: {
    key: string;
    label: string;
  }[];
}

export default function StaffResourcePage({
  title,
  description,
  endpoint,
  searchPlaceholder,
  columns,
}: StaffResourcePageProps) {
  return (
    <AdminResourcePage
      title={title}
      description={description}
      endpoint={endpoint}
      searchPlaceholder={searchPlaceholder}
      columns={columns}
    />
  );
}