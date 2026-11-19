import type { LucideIcon } from "lucide-react";

interface CustomerStatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}

export default function CustomerStatCard({
  title,
  value,
  description,
  icon: Icon,
}: CustomerStatCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          <Icon size={23} />
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}