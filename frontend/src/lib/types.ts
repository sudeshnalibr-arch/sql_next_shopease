import type { Product } from "@/types/product.types.";
import type {User} from "@/types/user.types"

export type { Product };

export type {User};

export interface CartItem {
  product: Product;
  quantity: number;
}

// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: "customer" | "admin";
// }

// export interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   stock: number;
//   image: string | null;
//   categoryId?: number;
// }


