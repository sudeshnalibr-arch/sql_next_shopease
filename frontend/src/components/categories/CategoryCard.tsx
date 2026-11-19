import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";

import type { Category } from "@/types/category.types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({
  category,
}: CategoryCardProps) {
  return (
    <Link
      href={`/products?categoryId=${category.id}`}
      className="group rounded-xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500 hover:shadow-lg"
    >
      <div className="mb-5 flex size-14 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition-colors group-hover:bg-orange-500 group-hover:text-white">
        <Layers className="size-7" />
      </div>

      <h3 className="text-lg font-semibold transition-colors group-hover:text-orange-500">
        {category.name}
      </h3>

      <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
        {category.description || "Explore products in this category."}
      </p>

      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-orange-600">
        Explore products
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}