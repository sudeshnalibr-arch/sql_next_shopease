"use client";

import { useState } from "react";
import Link from "next/link";
import { useForgotPassword } from "@/features/auth/auth.mutations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const mutation = useForgotPassword();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await mutation.mutateAsync({ email });
    } catch {
      // The error is displayed below.
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#0B0804] px-4 py-12">
      <Card className="w-full max-w-md border-orange-500/20 bg-[#120A05] text-[#FFF7ED]">
        <CardHeader>
          <CardTitle>Forgot password?</CardTitle>
          <p className="text-sm text-stone-400">
            Enter your email address to request a password reset.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="border-white/10 bg-[#1C1008]"
              />
            </div>

            {mutation.isSuccess && (
              <p className="text-sm text-emerald-400">
                If the request was accepted, check your email for further
                instructions.
              </p>
            )}

            {mutation.isError && (
              <p role="alert" className="text-sm text-red-400">
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : "Unable to submit your request. Please try again."}
              </p>
            )}

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-orange-500 text-white hover:bg-orange-600"
            >
              {mutation.isPending ? "Submitting..." : "Send reset link"}
            </Button>
          </form>

          <Link
            href="/login"
            className="mt-5 block text-center text-sm text-orange-400 hover:underline"
          >
            Back to login
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}