"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import type { Product } from "@/types/product.types.";
import type { ApiResponse } from "@/types/api";
import { useCart } from "@/providers/CartProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        const response = await axiosInstance.get<ApiResponse<Product>>(
          `/products/${params.id}`,
        );
        if (!cancelled) setProduct(response.data.data);
      } catch {
        if (!cancelled) setError("Product not found or unable to load.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadProduct();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (isLoading) return <p className="p-10 text-center">Loading product...</p>;

  if (error || !product) {
    return <p role="alert" className="p-10 text-center text-red-500">{error || "Product not found."}</p>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/products" className="mb-6 inline-flex items-center gap-2 text-sm text-orange-500">
        <ArrowLeft size={16} /> Back to products
      </Link>

      <Card className="overflow-hidden">
        <CardContent className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
          <div className="flex min-h-72 items-center justify-center rounded-xl bg-muted">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-96 w-full rounded-xl object-contain"
              />
            ) : (
              <span className="text-muted-foreground">No image available</span>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-4 text-2xl font-bold text-orange-500">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(Number(product.price))}
            </p>

            <p className="mt-5 leading-7 text-muted-foreground">
              {product.description || "No description available."}
            </p>

            <p className="mt-5 text-sm">
              Stock:{" "}
              {product.stock > 0 ? (
                <span className="text-emerald-500">{product.stock} available</span>
              ) : (
                <span className="text-red-500">Out of stock</span>
              )}
            </p>

            <Button
              className="mt-6 w-full bg-orange-500 text-white hover:bg-orange-600"
              disabled={!product.isActive || product.stock <= 0}
              onClick={() => {
                addToCart(product);
                toast.success("Product added to cart");
              }}
            >
              <ShoppingCart className="mr-2" size={18} />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
  
    </main>
  );
}