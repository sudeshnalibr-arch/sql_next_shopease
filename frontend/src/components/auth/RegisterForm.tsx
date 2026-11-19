
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useRegister } from "@/features/auth/auth.mutations";
import { registerSchema } from "@/features/auth/auth.schemas";
import type { RegisterInput } from "@/types/auth.types";
import { ROUTES } from "@/constants/routes";

export default function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: yupResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterInput) => {
    setServerError("");

    try {
      await registerMutation.mutateAsync(values);
      router.replace(ROUTES.AUTH.LOGIN);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Registration failed.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="register-name" className="mb-1 block text-sm font-medium">
          Full name
        </label>
        <input
          id="register-name"
          autoComplete="name"
          {...register("name")}
          className="w-full text-gray-700 rounded-md border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="register-email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="w-full text-gray-700 rounded-md border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="register-password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          className="w-full text-gray-700 rounded-md border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="text-sm text-red-600">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || registerMutation.isPending}
        className="w-full rounded-md bg-orange-500 px-4 py-2.5 font-medium text-white hover:bg-orange-600 disabled:opacity-60"
      >
        {isSubmitting || registerMutation.isPending
          ? "Creating account..."
          : "Create account"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link href={ROUTES.AUTH.LOGIN} className="font-medium text-orange-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
