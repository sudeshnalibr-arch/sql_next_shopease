
// "use client";

// import type { ReactNode } from "react";

// import NotificationSocket from
//   "@/features/notifications/NotificationSocket";

// import { useAuth } from "@/contexts/AuthContext";

// export default function ShopLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const { user } = useAuth();

//   const isAuthenticated = Boolean(user);

//   return (
//     <>
//       <NotificationSocket enabled={isAuthenticated} />

//       {children}
//     </>
//   );
// }



"use client";

import type { ReactNode } from "react";

import NotificationSocket from
  "@/features/notifications/NotificationSocket";

import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ShopLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <NotificationSocket
        enabled={!isLoading && isAuthenticated}
      />
      <Navbar/>
      {children}
      <Footer/>
    </>
  );
}
