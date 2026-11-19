
"use client";

interface SalesPoint {
  label: string;
  sales: number;
}

interface SalesChartProps {
  data: SalesPoint[];
  isLoading?: boolean;
}

export default function SalesChart({
  data,
  isLoading = false,
}: SalesChartProps) {
  if (isLoading) {
    return (
      <div className="h-72 animate-pulse rounded-xl bg-muted" />
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border text-sm text-muted-foreground">
        No sales data available.
      </div>
    );
  }

  const maxSales = Math.max(...data.map((point) => point.sales), 1);

  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="mb-6">
        <h2 className="font-semibold">Sales overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sales by period
        </p>
      </div>

      <div className="flex h-56 items-end gap-3 overflow-x-auto pb-2">
        {data.map((point, index) => {
          const height = Math.max((point.sales / maxSales) * 100, 2);

          return (
            <div
              key={`${point.label}-${index}`}
              className="group flex min-w-10 flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-xs text-muted-foreground">
                {point.sales.toLocaleString("en-IN")}
              </span>
              <div
                title={`${point.label}: ₹${point.sales.toLocaleString("en-IN")}`}
                className="w-full max-w-14 rounded-t-md bg-orange-500 transition-opacity group-hover:opacity-75"
                style={{ height: `${height}%` }}
              />
              <span className="max-w-16 truncate text-xs text-muted-foreground">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
