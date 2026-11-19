
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  ShoppingBag,
  RefreshCw,
  Sparkles,
  Zap,
  Star,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import api, { getErrorMessage } from "@/lib/axiosInstance";
import ProductGrid from "@/components/products/ProductGrid";
import type { Product } from "@/lib/types";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Extend the product type only for optional landing-page fields.
// Keep your existing Product type unchanged.
type LandingProduct = Product & {
  brand?: string | { name?: string };
  createdAt?: string;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const getBrandName = (product: LandingProduct): string => {
  if (typeof product.brand === "string") {
    return product.brand.trim();
  }

  if (product.brand && typeof product.brand === "object") {
    return product.brand.name?.trim() ?? "";
  }

  return "";
};

export default function HomePage() {
  const [products, setProducts] = useState<LandingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const shouldReduceMotion = useReducedMotion();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.get("/products");

      const payload = response.data?.data ?? response.data;

      const productList = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.products)
          ? payload.products
          : Array.isArray(payload?.rows)
            ? payload.rows
            : [];

      setProducts(productList);
    } catch (err: unknown) {
      setError(
        getErrorMessage(err, "Unable to load products.")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  // First eight products for the featured section.
  const featuredProducts = useMemo(
    () => products.slice(0, 8),
    [products]
  );

  // Latest products based on createdAt when available.
  const latestProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;

        const dateB = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;

        return dateB - dateA;
      })
      .slice(0, 8);
  }, [products]);

  // Get actual brand names from database records.
  const brands = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map(getBrandName)
          .filter(Boolean)
      )
    ).slice(0, 8);
  }, [products]);

  const animation = shouldReduceMotion
    ? {}
    : {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.15 },
        variants: containerVariants,
      };

  return (
    
    <main className="overflow-hidden bg-white">
      <Navbar/>
      {/* ================= HERO SECTION ================= */}

      <section className="relative isolate overflow-hidden bg-[#FFF8F1]">

        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8 lg:py-32">

          {/* Hero content */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
              <Sparkles size={16} />
              Welcome to ShopEase
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Shopping that feels
              <span className="mt-2 block text-orange-500">
                simple and special.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              Discover products you'll love, explore your favorite
              collections, and enjoy a convenient shopping experience
              from browsing to checkout.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 rounded-xl bg-orange-500 px-7 py-4 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-1 hover:bg-orange-600"
              >
                Explore Products

                <ArrowRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-7 py-4 font-semibold text-gray-800 transition hover:border-orange-400 hover:text-orange-600"
              >
                Join ShopEase
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 text-sm font-medium text-gray-600">
              <span className="flex items-center gap-2">
                <ShieldCheck size={19} className="text-orange-500" />
                Secure shopping
              </span>

              <span className="flex items-center gap-2">
                <Truck size={19} className="text-orange-500" />
                Convenient delivery
              </span>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="absolute inset-10 rounded-full bg-orange-300/30 blur-3xl" />

            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: [0, -10, 0] }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative rounded-[2rem] border border-white bg-white/80 p-5 shadow-2xl shadow-orange-900/10 backdrop-blur-xl sm:p-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Discover more
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-950">
                    Your favorites await.
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <ShoppingBag size={29} />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-orange-50 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <Sparkles size={24} />
                  </div>

                  <h3 className="mt-5 font-bold text-gray-900">
                    Discover
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Explore products and collections.
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Zap size={24} />
                  </div>

                  <h3 className="mt-5 font-bold text-gray-900">
                    Shop easily
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Enjoy a smooth shopping journey.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-4 rounded-2xl border border-orange-100 bg-white p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <Headphones size={23} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    We're here to help
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    A convenient experience, every step of the way.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ================= BENEFITS BAR ================= */}

      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">

          {[
            {
              icon: ShieldCheck,
              title: "Secure Shopping",
              description: "Shop with confidence",
            },
            {
              icon: Truck,
              title: "Easy Delivery",
              description: "Convenient order tracking",
            },
            {
              icon: ShoppingBag,
              title: "Easy Checkout",
              description: "Simple ordering process",
            },
            {
              icon: Headphones,
              title: "Customer Support",
              description: "Help when you need it",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <item.icon size={22} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

        <motion.div
          {...animation}
          className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-orange-500">
              <Star size={16} />
              Handpicked for you
            </div>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
              Featured Products
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-gray-600">
              Explore our collection and discover products worth adding
              to your shopping list.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 font-semibold text-orange-600 transition hover:text-orange-700"
            >
              View all products

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <p className="font-medium text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => void fetchProducts()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        ) : (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ProductGrid
              products={featuredProducts}
              isLoading={isLoading}
            />
          </motion.div>
        )}

        {!isLoading && !error && featuredProducts.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-orange-500 px-7 py-3.5 font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white"
            >
              Explore the collection
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </section>

      {/* ================= POPULAR BRANDS ================= */}

      {!isLoading && brands.length > 0 && (
        <section className="border-y border-gray-100 bg-[#FFF9F4] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Explore brands
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-gray-950">
                Brands available in our store
              </h2>

              <p className="mt-3 text-gray-600">
                Discover products from brands in our collection.
              </p>
            </div>

            <motion.div
              {...animation}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              {brands.map((brand) => (
                <motion.div
                  key={brand}
                  variants={itemVariants}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : { y: -5, scale: 1.03 }
                  }
                >
                  <Link
                    href={`/products?brand=${encodeURIComponent(brand)}`}
                    className="flex min-w-36 items-center justify-center rounded-xl border border-orange-100 bg-white px-7 py-5 text-center font-bold text-gray-800 shadow-sm transition hover:border-orange-300 hover:text-orange-600 hover:shadow-md"
                  >
                    {brand}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>
      )}

      {/* ================= LATEST PRODUCTS ================= */}

      {!isLoading && !error && latestProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

          <motion.div
            {...animation}
            className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
          >
            <motion.div variants={itemVariants}>
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Fresh finds
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                Explore Our Collection
              </h2>

              <p className="mt-3 text-gray-600">
                Take another look at the products available in our store.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 font-semibold text-orange-600 hover:text-orange-700"
              >
                Browse everything
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ProductGrid
              products={latestProducts}
              isLoading={false}
            />
          </motion.div>

        </section>
      )}

      {/* ================= FINAL CTA ================= */}

      <section className="relative overflow-hidden bg-[#17100B]">

        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center lg:px-8 lg:py-20"
        >
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-orange-400">
              <Sparkles size={16} />
              Your next discovery starts here
            </p>

            <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Find something you'll love at ShopEase.
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-gray-300">
              Browse our products, discover your favorites, and enjoy
              shopping with ease.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex shrink-0 items-center gap-3 rounded-xl bg-orange-500 px-7 py-4 font-bold text-white shadow-lg shadow-orange-950/30 transition hover:-translate-y-1 hover:bg-orange-400"
          >
            Start Shopping

            <ArrowRight
              size={19}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </section>
        <Footer/>
    </main>
  );
}
