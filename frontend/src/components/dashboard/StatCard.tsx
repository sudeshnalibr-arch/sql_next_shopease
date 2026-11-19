
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  icon?: LucideIcon;
}

export default function StatCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
}: StatCardProps) {
  const positive = trend !== undefined && trend >= 0;

  return (
    <article className="rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
        </div>

        {Icon && (
          <div className="rounded-lg bg-orange-100 p-3 text-orange-700">
            <Icon className="size-5" />
          </div>
        )}
      </div>

      {(description || trend !== undefined) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend !== undefined && (
            <span className={`flex items-center gap-1 font-medium ${positive ? "text-emerald-600" : "text-red-600"}`}>
              {positive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
              {Math.abs(trend)}%
            </span>
          )}
          {description && (
            <span className="text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </article>
  );
}
