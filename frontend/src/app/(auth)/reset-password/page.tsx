"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "@/features/auth/auth.mutations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const mutation = useResetPassword();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) return;

    try {
      await mutation.mutateAsync({
        token,
        password,
        confirmPassword,
      });
    } catch {
      // The error is displayed below.
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#0B0804] px-4 py-12">
      <Card className="w-full max-w-md border-orange-500/20 bg-[#120A05] text-[#FFF7ED]">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <p className="text-sm text-stone-400">
            Choose a new password for your account.
          </p>
        </CardHeader>

        <CardContent>
          {!token ? (
            <div className="space-y-4">
              <p className="text-sm text-red-400">
                The reset token is missing. Please use the link from your
                password-reset email.
              </p>
              <Link href="/forgot-password" className="text-orange-400 hover:underline">
                Request another reset link
              </Link>
            </div>
          ) : mutation.isSuccess ? (
            <div className="space-y-4">
              <p className="text-sm text-emerald-400">
                Your password reset request was successful.
              </p>
              <Link href="/login" className="text-orange-400 hover:underline">
                Continue to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="border-white/10 bg-[#1C1008]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  className="border-white/10 bg-[#1C1008]"
                />
              </div>

              {password !== confirmPassword && confirmPassword && (
                <p className="text-sm text-red-400">
                  Passwords do not match.
                </p>
              )}

              {mutation.isError && (
                <p role="alert" className="text-sm text-red-400">
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : "Unable to reset your password."}
                </p>
              )}

              <Button
                type="submit"
                disabled={
                  mutation.isPending ||
                  password !== confirmPassword ||
                  password.length < 8
                }
                className="w-full bg-orange-500 text-white hover:bg-orange-600"
              >
                {mutation.isPending ? "Resetting..." : "Reset password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}