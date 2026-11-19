
"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { authApi } from "./auth.api";
import { queryKeys } from "@/lib/queryKeys";

import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/types/auth.types";

// Login
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),

    onSuccess: (result) => {
      // Clear cached data belonging to a previous user.
      queryClient.clear();

      // Save access token for protected API requests.
      localStorage.setItem("accessToken", result.accessToken);

      // Update the Authorization header immediately.
      // The Axios interceptor will also read localStorage.
      // Store the authenticated user in React Query.
      queryClient.setQueryData(queryKeys.auth.me(), {
        user: result.user,
      });
    },
  });
}

// Registration
export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      authApi.register(input),
  });
}

// Logout
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,

    onSettled: () => {
      // Remove access token whether logout succeeds or fails.
      localStorage.removeItem("accessToken");

      // Clear the authenticated user's cached data.
      queryClient.clear();
    },
  });
}

// Forgot password
export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) =>
      authApi.forgotPassword(input),
  });
}

// Reset password
export function useResetPassword() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) =>
      authApi.resetPassword(input),
  });
}
