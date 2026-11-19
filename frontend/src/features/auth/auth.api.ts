import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  LoginInput,
  RegisterInput,
  AuthResponse,
  CurrentUserResponse,
  ForgotPasswordInput,
  ResetPasswordInput,
  RefreshResponse,
  RegisterResponse,
} from "@/types/auth.types";

export const authApi = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await axiosInstance.post<
      ApiResponse<AuthResponse>
    >("/auth/login", input);

    return response.data.data;
  },

  async register(input: RegisterInput): Promise<RegisterResponse> {
  const response = await axiosInstance.post<
    ApiResponse<RegisterResponse>
  >("/auth/register", input);

  return response.data.data;
},

  async getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await axiosInstance.get<
      ApiResponse<CurrentUserResponse>
    >("/auth/me");

    return response.data.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post("/auth/logout");
  },

  // async refresh(): Promise<AuthResponse> {
  //   const response = await axiosInstance.post<
  //     ApiResponse<AuthResponse>
  //   >("/auth/refresh");

  //   return response.data.data;
  // },

async refresh(): Promise<RefreshResponse> {
  const response = await axiosInstance.post<
    ApiResponse<RefreshResponse>
  >("/auth/refresh");

  return response.data.data;
},

  async forgotPassword(
    input: ForgotPasswordInput,
  ): Promise<void> {
    await axiosInstance.post("/auth/forgot-password", input);
  },

  async resetPassword(
    input: ResetPasswordInput,
  ): Promise<void> {
    await axiosInstance.post("/auth/reset-password", input);
  },
};