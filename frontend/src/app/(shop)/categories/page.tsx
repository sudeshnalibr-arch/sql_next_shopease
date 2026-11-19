"use client";

import { useState } from "react";
import { Search, Layers } from "lucide-react";

import { useCategories } from "@/hooks/useCategories";
import CategoryCard from "@/components/categories/CategoryCard";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useCategories({
    page: 1,
    limit: 100,
    search,
    isActive: true,
  });

  const categories = data?.data ?? [];

  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-orange-50 px-4 py-16 dark:bg-orange-950/20">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-orange-500 text-white">
            <Layers className="size-7" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Shop by Category
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Explore our product collections and discover
            something you love.
          </p>
        </div>
      </section>

      {/* Category Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Search */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold">
              All Categories
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {categories.length} categories available
            </p>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              placeholder="Search categories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-52 animate-pulse rounded-xl border bg-muted/50"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:bg-red-950/20">
            <p className="font-medium text-red-600">
              Unable to load categories.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && categories.length === 0 && (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <Layers className="mx-auto size-10 text-muted-foreground" />

            <h3 className="mt-4 text-lg font-semibold">
              No categories found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Try another search term.
            </p>
          </div>
        )}

        {/* Category Grid */}
        {!isLoading && !isError && categories.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}