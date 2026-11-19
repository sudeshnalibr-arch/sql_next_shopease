
"use client";

import { useEffect, useState, type FormEvent } from "react";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "@/types/product.types.";

interface ProductFormProps {
  product?: Product;
  onSubmit: (
    values: CreateProductInput | UpdateProductInput,
  ) => Promise<void>;
}

export default function ProductForm({
  product,
  onSubmit,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryId, setCategoryId] = useState(String(product?.categoryId ?? ""));
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [stock, setStock] = useState(String(product?.stock ?? ""));
  const [image, setImage] = useState(product?.image ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(product?.name ?? "");
    setDescription(product?.description ?? "");
    setCategoryId(String(product?.categoryId ?? ""));
    setPrice(String(product?.price ?? ""));
    setStock(String(product?.stock ?? ""));
    setImage(product?.image ?? "");
  }, [product]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsedCategoryId = Number(categoryId);
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (
      !name.trim() ||
      !Number.isInteger(parsedCategoryId) ||
      parsedCategoryId <= 0 ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0 ||
      !Number.isInteger(parsedStock) ||
      parsedStock < 0
    ) {
      setError("Enter a valid name, category, price, and stock quantity.");
      return;
    }

    const values = {
      name: name.trim(),
      description: description.trim(),
      categoryId: parsedCategoryId,
      price: parsedPrice,
      stock: parsedStock,
      image: image.trim() || null,
    };

    setSaving(true);

    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="product-name" className="mb-1 block text-sm font-medium">
          Product name
        </label>
        <input
          id="product-name"
          required
          maxLength={150}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="product-description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="product-description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="product-category" className="mb-1 block text-sm font-medium">
            Category ID
          </label>
          <input
            id="product-category"
            type="number"
            min="1"
            required
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="product-price" className="mb-1 block text-sm font-medium">
            Price (₹)
          </label>
          <input
            id="product-price"
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="product-stock" className="mb-1 block text-sm font-medium">
            Stock
          </label>
          <input
            id="product-stock"
            type="number"
            min="0"
            step="1"
            required
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="product-image" className="mb-1 block text-sm font-medium">
          Image URL
        </label>
        <input
          id="product-image"
          type="url"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://example.com/product.jpg"
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-orange-500 px-5 py-2.5 font-medium text-white hover:bg-orange-600 disabled:opacity-60"
      >
        {saving ? "Saving..." : product ? "Update product" : "Create product"}
      </button>
    </form>
  );
}
