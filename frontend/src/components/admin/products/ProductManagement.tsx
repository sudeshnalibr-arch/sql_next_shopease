
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Plus,
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";

import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/features/admin/products/product.queries";

import type {
  Product,
  ProductListParams,
  CreateProductInput,
  UpdateProductInput,
} from "@/features/admin/products/product.types";

import ProductFormDialog from "./ProductFormDialog";
import ProductTable from "./ProductTable";
import ProductDeleteDialog from "./ProductDeleteDialog";

export default function ProductManagement() {
  const { role } = useAuth();

  // Role permissions
  const canCreate =
    role === "admin" ||
    role === "manager" ||
    role === "staff";

  const canUpdate =
    role === "admin" ||
    role === "manager";

  const canDelete = role === "admin";

  // Pagination and search
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const limit = 10;

  const params: ProductListParams = {
    page,
    limit,
    ...(search.trim() ? { search: search.trim() } : {}),
  };

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  // Queries
  const {
    data,
    isLoading,
    isError,
    error,
  } = useProducts(params);

  // Mutations
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

  // Open create dialog
  const handleCreate = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  // Open edit dialog
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  // Open delete confirmation
  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  // Create or update
  const handleFormSubmit = async (
    values: CreateProductInput | UpdateProductInput
  ) => {
    try {
      if ("id" in values) {
        await updateMutation.mutateAsync(
          values as UpdateProductInput
        );

        toast.success("Product updated successfully.");
      } else {
        await createMutation.mutateAsync(
          values as CreateProductInput
        );

        toast.success("Product created successfully.");
      }

      setFormOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Product save error:", error);
      toast.error("Unable to save product. Please try again.");
    }
  };

  // Soft delete
  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      await deleteMutation.mutateAsync(selectedProduct.id);

      toast.success("Product deactivated successfully.");

      setDeleteOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Product delete error:", error);
      toast.error("Unable to deactivate product.");
    }
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />

            <h1 className="text-2xl font-bold tracking-tight">
              Product Management
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your store products, inventory and images.
          </p>
        </div>

        {canCreate && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      {/* PRODUCT SUMMARY */}
      <div className="rounded-xl border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Products matching your current filters
        </p>

        <p className="mt-1 text-2xl font-bold">
          {pagination?.total ?? 0}
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search products..."
          className="pl-9"
        />
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="rounded-xl border py-16 text-center text-sm text-muted-foreground">
          Loading products...
        </div>
      )}

      {/* ERROR */}
      {isError && (
        <div className="rounded-xl border border-destructive/30 p-6 text-center">
          <p className="font-medium text-destructive">
            Failed to load products.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Please try again later."}
          </p>
        </div>
      )}

      {/* TABLE */}
      {!isLoading && !isError && (
        <>
          <ProductTable
            products={products}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* PAGINATION */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
                {" · "}
                {pagination.total} products
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((previous) => Math.max(1, previous - 1))
                  }
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() =>
                    setPage((previous) => previous + 1)
                  }
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* CREATE / UPDATE DIALOG */}
      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={selectedProduct}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* SOFT DELETE DIALOG */}
      <ProductDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={selectedProduct}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
