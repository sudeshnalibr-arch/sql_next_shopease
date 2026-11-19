
import type { Metadata } from "next";
import "./globals.css";

import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "ShopEase | Online Shopping",
    template: "%s | ShopEase",
  },
  description:
    "Discover quality products at great prices with ShopEase. Shop online and manage your orders with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Providers>
        
          <main className="min-h-[70vh]">{children}</main>

          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
