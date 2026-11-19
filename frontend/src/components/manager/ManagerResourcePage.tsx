
"use client";

import AdminResourcePage from "@/components/admin/AdminResourcePage";

interface Column {
  key: string;
  label: string;
  render?: (value: unknown, row?: Record<string, unknown>) => React.ReactNode;
}

interface ManagerResourcePageProps {
  title: string;
  description: string;
  endpoint: string;
  searchPlaceholder: string;
  columns: Column[];
}

export default function ManagerResourcePage({
  title,
  description,
  endpoint,
  searchPlaceholder,
  columns,
}: ManagerResourcePageProps) {
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
