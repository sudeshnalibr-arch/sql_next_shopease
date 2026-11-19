export interface StaffProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "staff";
  isActive: boolean;
}

export interface StaffProfileResponse {
  success: boolean;
  message: string;
  data: StaffProfile;
}

export interface UpdateStaffProfilePayload {
  name: string;
  phone: string;
}