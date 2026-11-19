
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import type {
  Product,
  ProductFormValues,
  CreateProductInput,
  UpdateProductInput,
} from "@/features/admin/products/product.types";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (
    values: CreateProductInput | UpdateProductInput
  ) => Promise<void>;
  isSubmitting: boolean;
}

const initialValues: ProductFormValues = {
  name: "",
  description: "",
  categoryId: "",
  price: "",
  stock: "",
  image: null,
  isActive: true,
};

export default function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  isSubmitting,
}: ProductFormDialogProps) {
  const [values, setValues] =
    useState<ProductFormValues>(initialValues);

  const [preview, setPreview] = useState<string | null>(null);

  const isEditing = Boolean(product);

  useEffect(() => {
    if (!open) return;

    if (product) {
      setValues({
        name: product.name,
        description: product.description ?? "",
        categoryId: String(product.categoryId),
        price: String(product.price),
        stock: String(product.stock),
        image: null,
        isActive: product.isActive,
      });

      setPreview(product.image);
    } else {
      setValues(initialValues);
      setPreview(null);
    }
  }, [product, open]);

  const handleChange = (
    field: keyof ProductFormValues,
    value: string | boolean | File | null
  ) => {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPEG, PNG, WebP or GIF image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    handleChange("image", file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const categoryId = Number(values.categoryId);
    const price = Number(values.price);
    const stock = Number(values.stock);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      alert("Please enter a valid category ID.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      alert("Please enter a valid price greater than zero.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    const payload: CreateProductInput | UpdateProductInput = {
      name: values.name.trim(),
      description: values.description.trim(),
      categoryId,
      price,
      stock,
      image: values.image,
      ...(isEditing && product
        ? {
            id: product.id,
            isActive: values.isActive,
          }
        : {}),
    };

    await onSubmit(payload);
  };

  const handleDialogChange = (nextOpen: boolean) => {
    if (isSubmitting) return;

    if (!nextOpen && preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Update Product" : "Create Product"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the product information and image."
              : "Enter the details to add a new product."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name</Label>

            <Input
              id="product-name"
              value={values.name}
              onChange={(event) =>
                handleChange("name", event.target.value)
              }
              placeholder="Enter product name"
              minLength={2}
              maxLength={150}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-description">
              Description
            </Label>

            <Textarea
              id="product-description"
              value={values.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-category">
                Category ID
              </Label>

              <Input
                id="product-category"
                type="number"
                min="1"
                value={values.categoryId}
                onChange={(event) =>
                  handleChange("categoryId", event.target.value)
                }
                placeholder="Category ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-price">Price</Label>

              <Input
                id="product-price"
                type="number"
                min="0.01"
                step="0.01"
                value={values.price}
                onChange={(event) =>
                  handleChange("price", event.target.value)
                }
                placeholder="Enter price"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-stock">Stock</Label>

            <Input
              id="product-stock"
              type="number"
              min="0"
              step="1"
              value={values.stock}
              onChange={(event) =>
                handleChange("stock", event.target.value)
              }
              placeholder="Enter stock quantity"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-image">Product Image</Label>

            <Input
              id="product-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
            />

            <p className="text-xs text-muted-foreground">
              JPEG, PNG, WebP or GIF. Maximum size: 5 MB.
              {isEditing && " Leave empty to keep the existing image."}
            </p>

            {preview && (
              <div className="relative mt-3 h-40 w-40 overflow-hidden rounded-lg border">
                <Image
                  src={preview}
                  alt="Product preview"
                  fill
                  unoptimized={preview.startsWith("blob:")}
                  className="object-cover"
                  sizes="160px"
                />
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="product-active">
                  Active Product
                </Label>

                <p className="text-xs text-muted-foreground">
                  Inactive products are hidden from the storefront.
                </p>
              </div>

              <Switch
                id="product-active"
                checked={values.isActive}
                onCheckedChange={(checked) =>
                  handleChange("isActive", checked)
                }
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleDialogChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update Product"
                  : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
