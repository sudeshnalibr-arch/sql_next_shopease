"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/constants/roles";
import type { UserRole } from "@/types/user.types";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  if (isLoading) return <main className="p-10">Loading profile...</main>;

  if (!user) {
    router.push("/login?next=/profile");
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      // Confirm this route and permitted fields in your backend.
      await axiosInstance.patch("/users/me", { name });
      toast.success("Profile update submitted.");
      router.refresh();
    } catch {
      toast.error("Unable to update your profile. Check your API route.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="mt-1 font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="mt-1 font-medium">
              {ROLE_LABELS[user.role as UserRole] ?? user.role}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name || user.name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={100}
            />

            <Button type="submit" disabled={saving} className="bg-orange-500 hover:bg-orange-600">
              {saving ? "Saving..." : "Update name"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}