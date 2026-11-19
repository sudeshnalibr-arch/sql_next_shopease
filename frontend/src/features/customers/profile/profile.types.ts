export interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "customer";
  isActive: boolean;
}

export interface CustomerProfileResponse {
  success: boolean;
  message: string;
  data: CustomerProfile;
}

export interface UpdateCustomerProfilePayload {
  name: string;
  phone: string;
}