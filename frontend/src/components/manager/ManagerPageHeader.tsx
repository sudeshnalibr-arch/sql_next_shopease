
import { ReactNode } from "react";

interface ManagerPageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function ManagerPageHeader({
  title,
  description,
  action,
}: ManagerPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      {action}
    </div>
  );
}
