
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useLogin } from "@/features/auth/auth.mutations";
import { loginSchema } from "@/features/auth/auth.schemas";
import type { LoginInput } from "@/types/auth.types";
import { ROUTES } from "@/constants/routes";

function getDashboard(role: string) {
  switch (role) {
    case "admin":
      return ROUTES.ADMIN.DASHBOARD;
    case "manager":
      return ROUTES.MANAGER.DASHBOARD;
    case "staff":
      return ROUTES.STAFF.DASHBOARD;
    default:
      return ROUTES.HOME;
  }
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    setServerError("");

    try {
      const result = await loginMutation.mutateAsync(values);
      const requestedPath = searchParams.get("next");

      // Only accept internal relative paths to prevent open redirects.
      const safeNext =
        requestedPath?.startsWith("/") &&
        !requestedPath.startsWith("//")
          ? requestedPath
          : null;

      router.replace(
        safeNext ?? getDashboard(result.user.role),
      );
      router.refresh();
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Unable to log in.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="login-email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="w-full rounded-md border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="login-password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className="w-full rounded-md border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="text-right text-sm">
        <Link href={ROUTES.AUTH.FORGOT_PASSWORD} className="text-orange-600 hover:underline">
          Forgot password?
        </Link>
      </div>

      {(serverError || loginMutation.isError) && (
        <p role="alert" className="text-sm text-red-600">
          {serverError || "Login failed. Check your credentials and try again."}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || loginMutation.isPending}
        className="w-full rounded-md bg-orange-500 px-4 py-2.5 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting || loginMutation.isPending ? "Signing in..." : "Login"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href={ROUTES.AUTH.REGISTER} className="font-medium text-orange-600 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
