"use client";

import { Edit, Power } from "lucide-react";

import type { Category } from "@/types/category.types";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
  isUpdating: boolean;
}

export default function CategoryTable({
  categories,
  onEdit,
  onToggleStatus,
  isUpdating,
}: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="font-medium">No categories found.</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Create a category to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-5 py-4 font-semibold">Category</th>
            <th className="px-5 py-4 font-semibold">Description</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 text-right font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {categories.map((category) => (
            <tr key={category.id} className="transition hover:bg-muted/30">
              <td className="px-5 py-4">
                <div className="font-medium">{category.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  ID: {category.id}
                </div>
              </td>

              <td className="max-w-xs px-5 py-4 text-muted-foreground">
                <p className="line-clamp-2">
                  {category.description || "No description"}
                </p>
              </td>

              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    category.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs font-medium hover:bg-muted"
                  >
                    <Edit className="size-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onToggleStatus(category)}
                    className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs font-medium disabled:opacity-50 ${
                      category.isActive
                        ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        : "text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                    }`}
                  >
                    <Power className="size-3.5" />
                    {category.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}