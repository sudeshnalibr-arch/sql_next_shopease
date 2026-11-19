export interface StaffCustomer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  totalOrders: number;
  createdAt: string;
}

export interface StaffCustomersResponse {
  success: boolean;
  message: string;
  data: StaffCustomer[];
}