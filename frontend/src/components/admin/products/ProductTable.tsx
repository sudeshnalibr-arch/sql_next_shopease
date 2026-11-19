
"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pencil,
  Trash2,
  Package,
} from "lucide-react";

import type { Product } from "@/features/admin/products/product.types";

interface ProductTableProps {
  products: Product[];
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
  canUpdate,
  canDelete,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <Package className="mb-3 h-10 w-10 text-muted-foreground" />

        <h3 className="font-semibold">No products found</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Products will appear here when they are available.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>

            {(canUpdate || canDelete) && (
              <TableHead className="text-right">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-muted">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="max-w-[180px] truncate font-medium">
                      {product.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      ID: {product.id}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell>{product.categoryId}</TableCell>

              <TableCell className="font-medium">
                ₹{Number(product.price).toFixed(2)}
              </TableCell>

              <TableCell>
                <span
                  className={
                    product.stock === 0
                      ? "font-medium text-destructive"
                      : ""
                  }
                >
                  {product.stock}
                </span>
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    product.isActive ? "default" : "secondary"
                  }
                >
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              {(canUpdate || canDelete) && (
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {canUpdate && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(product)}
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}

                    {canDelete && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => onDelete(product)}
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
