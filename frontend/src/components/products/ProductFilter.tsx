
"use client";

import { useEffect, useState } from "react";

import type { ProductFilters as Filters } from "@/types/product.types.";
import { useDebounce } from "@/hooks/useDebounce";

interface ProductFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function ProductFilters({
  filters,
  onChange,
}: ProductFiltersProps) {
  const [search, setSearch] = useState(filters.search ?? "");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch === (filters.search ?? "")) return;
    onChange({ ...filters, search: debouncedSearch, page: 1 });
  }, [debouncedSearch]); // Parent should keep onChange stable or memoize it.

  return (
    <section className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label htmlFor="product-search" className="mb-1 block text-sm font-medium">
          Search products
        </label>
        <input
          id="product-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="min-price" className="mb-1 block text-sm font-medium">
          Minimum price
        </label>
        <input
          id="min-price"
          type="number"
          min="0"
          value={filters.minPrice ?? ""}
          onChange={(event) =>
            onChange({
              ...filters,
              minPrice: event.target.value === "" ? undefined : Number(event.target.value),
              page: 1,
            })
          }
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="max-price" className="mb-1 block text-sm font-medium">
          Maximum price
        </label>
        <input
          id="max-price"
          type="number"
          min="0"
          value={filters.maxPrice ?? ""}
          onChange={(event) =>
            onChange({
              ...filters,
              maxPrice: event.target.value === "" ? undefined : Number(event.target.value),
              page: 1,
            })
          }
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="product-sort" className="mb-1 block text-sm font-medium">
          Sort by
        </label>
        <select
          id="product-sort"
          value={`${filters.sortBy ?? "createdAt"}:${filters.sortOrder ?? "DESC"}`}
          onChange={(event) => {
            const [sortBy, sortOrder] = event.target.value.split(":") as [
              NonNullable<Filters["sortBy"]>,
              NonNullable<Filters["sortOrder"]>,
            ];

            onChange({ ...filters, sortBy, sortOrder, page: 1 });
          }}
          className="w-full rounded-md border bg-background px-3 py-2"
        >
          <option value="createdAt:DESC">Newest first</option>
          <option value="name:ASC">Name: A–Z</option>
          <option value="name:DESC">Name: Z–A</option>
          <option value="price:ASC">Price: low to high</option>
          <option value="price:DESC">Price: high to low</option>
        </select>
      </div>
    </section>
  );
}
