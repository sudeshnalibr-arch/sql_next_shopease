export interface CustomerAddress {
  id: number;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface AddressPayload {
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CustomerAddressesResponse {
  success: boolean;
  message: string;
  data: CustomerAddress[];
}

export interface CustomerAddressResponse {
  success: boolean;
  message: string;
  data: CustomerAddress;
}