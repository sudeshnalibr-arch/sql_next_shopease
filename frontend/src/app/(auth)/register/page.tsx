import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#0B0804] px-4 py-12">
      <Card className="w-full max-w-lg border-orange-500/20 bg-[#120A05] text-[#FFF7ED]">
        <CardHeader className="text-center">
          <p className="font-semibold text-orange-400">ShopEase</p>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <p className="text-sm text-stone-400">
            Join us and start shopping.
          </p>
        </CardHeader>

        <CardContent>
          <RegisterForm />

          {/* <p className="mt-5 text-center text-sm text-stone-400">
            Already registered?{" "}
            <Link href="/login" className="text-orange-400 hover:underline">
              Sign in
            </Link>
          </p> */}
        </CardContent>
      </Card>
    </main>
  );
}