// "use client";

// import { useEffect, useState } from "react";

// export default function Footer() {
//   const [currentYear, setCurrentYear] = useState<number | null>(null);

//   useEffect(() => {
//     setCurrentYear(new Date().getFullYear());
//   }, []);

//   return (
//     <footer className="border-t border-gray-200 bg-white">
//       <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
//         © {currentYear ?? "2026"} ShopEase. All rights reserved.
//       </div>
//     </footer>
//   );
// }



import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import CopyrightYear from "./CopyrightYear";

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href={ROUTES.HOME} className="text-xl font-bold">
            Shop<span className="text-orange-500">Ease</span>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            Shopping made simple.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          <Link href={ROUTES.PRODUCTS.LIST} className="hover:text-foreground">
            Products
          </Link>
          <Link href={ROUTES.ORDERS.LIST} className="hover:text-foreground">
            Orders
          </Link>
          <Link href={ROUTES.AUTH.LOGIN} className="hover:text-foreground">
            Account
          </Link>
        </div>

        <CopyrightYear />
      </div>
    </footer>
  );
}
