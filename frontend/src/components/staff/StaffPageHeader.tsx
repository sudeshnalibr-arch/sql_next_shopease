import type { ReactNode } from "react";

interface StaffPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function StaffPageHeader({
  title,
  description,
  action,
}: StaffPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}