"use clients"

import type { Product } from "@/types/product.types.";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
}

export default function ProductGrid({
  products,
  isLoading = false,
  error = null,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse space-y-3 rounded-xl border p-4">
            <div className="aspect-[4/3] rounded-lg bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-10 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p role="alert" className="py-8 text-center text-red-600">{error}</p>;
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="font-semibold">No products found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
