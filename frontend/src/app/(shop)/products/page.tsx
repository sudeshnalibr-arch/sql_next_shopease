"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import type { Product } from "@/types/product.types.";
import type { ApiResponse } from "@/types/api";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilter";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setIsLoading(true);
      setError("");

      try {
        const params = Object.fromEntries(
          Object.entries(filters).filter(
            ([, value]) => value !== "" && value !== undefined && value !== null,
          ),
        );

        const response = await axiosInstance.get<ApiResponse<unknown>>(
          "/products",
          { params },
        );

        const data = response.data.data as
          | Product[]
          | { products?: Product[]; items?: Product[] };

        const list = Array.isArray(data)
          ? data
          : data.products ?? data.items ?? [];

        if (!cancelled) setProducts(list);
      } catch {
        if (!cancelled) setError("Unable to load products. Please try again.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="font-semibold text-orange-500">ShopEase collection</p>
        <h1 className="mt-2 text-3xl font-bold">Explore Products</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Find products that match your needs.
        </p>
      </div>

      <div className="mb-8">
        <ProductFilters
          filters={filters as never}
          onChange={(nextFilters) => setFilters(nextFilters as Record<string, unknown>)}
        />
      </div>

      {error ? (
        <div role="alert" className="rounded-lg border border-red-500/30 p-4 text-red-500">
          {error}
        </div>
      ) : (
        <ProductGrid products={products} isLoading={isLoading} />
      )}
    </main>
  );
}