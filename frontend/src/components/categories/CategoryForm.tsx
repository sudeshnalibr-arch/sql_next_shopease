"use client";

import { useEffect, useState } from "react";

import type {
  Category,
  CategoryPayload,
} from "@/types/category.types";

interface CategoryFormProps {
  category?: Category | null;
  isSubmitting: boolean;
  onSubmit: (payload: CategoryPayload) => void;
  onCancel: () => void;
}

export default function CategoryForm({
  category,
  isSubmitting,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(category?.name ?? "");
    setDescription(category?.description ?? "");
  }, [category]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label
          htmlFor="category-name"
          className="mb-2 block text-sm font-medium"
        >
          Category Name
        </label>

        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Electronics"
          minLength={2}
          maxLength={100}
          required
          className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      <div>
        <label
          htmlFor="category-description"
          className="mb-2 block text-sm font-medium"
        >
          Description
        </label>

        <textarea
          id="category-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Write a short category description..."
          rows={4}
          className="w-full resize-none rounded-lg border bg-background p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || name.trim().length < 2}
          className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : category
              ? "Update Category"
              : "Create Category"}
        </button>
      </div>
    </form>
  );
}