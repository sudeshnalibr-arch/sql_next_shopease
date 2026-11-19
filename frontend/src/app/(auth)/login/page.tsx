import Link from "next/link";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
      <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading login page...
          </p>
        </div>
      }
    >
    <main className="flex min-h-[80vh] items-center justify-center bg-[#0B0804] px-4 py-12">
      <Card className="w-full max-w-md border-orange-500/20 bg-[#120A05] text-[#FFF7ED]">
        <CardHeader className="text-center">
          <p className="font-semibold text-orange-400">ShopEase</p>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <p className="text-sm text-stone-400">
            Sign in to continue shopping.
          </p>
        </CardHeader>

        <CardContent>
          <LoginForm />

          {/* <p className="mt-5 text-center text-sm text-stone-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-orange-400 hover:underline">
              Register
            </Link>
          </p> */}

          {/* <p className="mt-3 text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-orange-400 hover:underline"
            >
              Forgot password?
            </Link>
          </p> */}
        </CardContent>
      </Card>
    </main>
    </Suspense>
  );
}