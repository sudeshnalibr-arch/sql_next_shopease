// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   ShoppingCart,
//   ArrowLeft,
//   ArrowRight,
//   ShieldCheck,
//   Trash2,
// } from "lucide-react";

// import { useCart } from "@/context/CartContext";
// import { useAuth } from "@/context/AuthContext";
// import CartItem from "@/components/cart/CartItem";
// import PaymentModal from "@/components/cart/PaymentModal";
// import api, { getErrorMessage } from "@/lib/axiosInstance";

// export default function CartPage() {
//   const router = useRouter();

//   const {
//     cartItems,
//     cartCount,
//     cartTotal,
//     updateQuantity,
//     removeFromCart,
//     clearCart,
//   } = useCart();

//   const { isAuthenticated } = useAuth();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState("");
//   const [orderId, setOrderId] = useState<number | string | undefined>();

//   const shipping = 0;
//   const totalAmount = cartTotal + shipping;

//   const handleCheckout = async () => {
//     setError("");

//     if (!isAuthenticated) {
//       router.push("/login");
//       return;
//     }

//     if (cartItems.length === 0) {
//       setError("Your cart is empty.");
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const response = await api.post("/orders", {
//         items: cartItems.map((item) => ({
//           productId: Number(item.product.id),
//           quantity: item.quantity,
//         })),
//       });

//       const payload = response.data?.data ?? response.data;
//       const createdOrder = payload?.order ?? payload;

//       if (createdOrder?.id === undefined) {
//         throw new Error(
//           "The order response did not include an order ID. Please check your backend response."
//         );
//       }

//       setOrderId(createdOrder.id);
//       setIsModalOpen(true);
//     } catch (err: unknown) {
//       setError(getErrorMessage(err, "Unable to create your order."));
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleConfirmPayment = () => {
//     // Demo only. No real payment is processed here.
//     // Clear the cart only after the order has been created successfully.
//     clearCart();
//     setIsModalOpen(false);
//     router.push("/orders");
//   };

//   const handleCloseModal = () => {
//     if (isProcessing) return;
//     setIsModalOpen(false);
//   };

//   return (
//     <section className="min-h-screen bg-gray-50">
//       {/* Page heading */}
//       <div className="bg-gradient-to-r from-orange-500 to-amber-500">
//         <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//           <Link
//             href="/products"
//             className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white"
//           >
//             <ArrowLeft size={17} />
//             Continue Shopping
//           </Link>

//           <h1 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
//             Shopping Cart
//           </h1>

//           <p className="mt-3 text-orange-50">
//             Review your items before placing your order.
//           </p>
//         </div>
//       </div>

//       <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
//         {error && (
//           <div
//             role="alert"
//             className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
//           >
//             <p>{error}</p>
//             <button
//               type="button"
//               onClick={() => setError("")}
//               aria-label="Dismiss error"
//               className="font-semibold hover:text-red-900"
//             >
//               Dismiss
//             </button>
//           </div>
//         )}

//         {cartItems.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500">
//               <ShoppingCart size={30} />
//             </div>

//             <h2 className="mt-5 text-2xl font-bold text-gray-900">
//               Your cart is empty
//             </h2>

//             <p className="mt-2 text-gray-500">
//               You haven't added any products to your cart yet.
//             </p>

//             <Link
//               href="/products"
//               className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
//             >
//               Start Shopping
//               <ArrowRight size={18} />
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
//             {/* Cart items */}
//             <div className="space-y-5 lg:col-span-2">
//               <div className="flex flex-wrap items-center justify-between gap-3">
//                 <h2 className="text-xl font-bold text-gray-900">
//                   Your Items ({cartCount})
//                 </h2>

//                 <button
//                   type="button"
//                   onClick={clearCart}
//                   className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
//                 >
//                   <Trash2 size={16} />
//                   Clear Cart
//                 </button>
//               </div>

//               {cartItems.map((item) => (
//                 <CartItem
//                   key={item.product.id}
//                   item={item}
//                   onUpdateQuantity={updateQuantity}
//                   onRemove={removeFromCart}
//                 />
//               ))}

//               <Link
//                 href="/products"
//                 className="inline-flex items-center gap-2 py-2 font-medium text-orange-600 transition hover:text-orange-700"
//               >
//                 <ArrowLeft size={17} />
//                 Continue Shopping
//               </Link>
//             </div>

//             {/* Order summary */}
//             <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
//               <h2 className="text-xl font-bold text-gray-900">
//                 Order Summary
//               </h2>

//               <div className="mt-6 space-y-4">
//                 <div className="flex justify-between gap-4 text-sm">
//                   <span className="text-gray-500">
//                     Subtotal ({cartCount} items)
//                   </span>
//                   <span className="font-medium text-gray-900">
//                     ₹{cartTotal.toLocaleString("en-IN", {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </span>
//                 </div>

//                 <div className="flex justify-between gap-4 text-sm">
//                   <span className="text-gray-500">Shipping</span>
//                   <span className="font-medium text-green-600">
//                     {shipping === 0
//                       ? "Free"
//                       : `₹${shipping.toLocaleString("en-IN")}`}
//                   </span>
//                 </div>

//                 <div className="border-t border-gray-200 pt-4">
//                   <div className="flex justify-between gap-4">
//                     <span className="font-semibold text-gray-900">
//                       Total
//                     </span>
//                     <span className="text-xl font-bold text-orange-600">
//                       ₹{totalAmount.toLocaleString("en-IN", {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={handleCheckout}
//                 disabled={isProcessing || cartItems.length === 0}
//                 className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {isProcessing ? (
//                   <>
//                     <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Creating Order...
//                   </>
//                 ) : (
//                   <>
//                     Proceed to Checkout
//                     <ArrowRight size={18} />
//                   </>
//                 )}
//               </button>

//               {!isAuthenticated && (
//                 <p className="mt-3 text-center text-xs text-gray-500">
//                   You'll need to log in before placing your order.
//                 </p>
//               )}

//               <div className="mt-5 flex items-start gap-3 rounded-xl bg-gray-50 p-4">
//                 <ShieldCheck
//                   size={21}
//                   className="shrink-0 text-green-600"
//                 />
//                 <p className="text-xs leading-5 text-gray-500">
//                   Your order is submitted to the server. Product prices,
//                   stock, and order totals should be validated by the backend.
//                 </p>
//               </div>
//             </aside>
//           </div>
//         )}
//       </div>

//       <PaymentModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onConfirm={handleConfirmPayment}
//         isProcessing={isProcessing}
//         orderId={orderId}
//         totalAmount={totalAmount}
//       />
//     </section>
//   );
// }

"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { items, isCartLoaded } = useCart();

  if (!isCartLoaded) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">Loading cart...</main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border p-10 text-center">
          <ShoppingBag size={48} className="mb-4 text-orange-500" />
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">
            Browse products and add something you like.
          </p>
          {/* <Button asChild className="mt-5 bg-orange-500 hover:bg-orange-600">
            <Link href="/products">Browse products</Link>
          </Button> */}

          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-orange-500 text-white hover:bg-orange-600",
            )}
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          <CartSummary />
        </div>
      )}
    </main>
  );
}
