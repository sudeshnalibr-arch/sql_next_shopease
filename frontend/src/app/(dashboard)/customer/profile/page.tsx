"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Save,
} from "lucide-react";

import CustomerPageHeader from "@/components/customer/CustomerPageHeader";

import {
  useCustomerProfile,
  useUpdateCustomerProfile,
} from "@/features/customers/profile/profile.queries";

export default function CustomerProfilePage() {
  const { data, isLoading, isError } = useCustomerProfile();
  const updateProfile = useUpdateCustomerProfile();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (data) {
      setName(data.name ?? "");
      setPhone(data.phone ?? "");
    }
  }, [data]);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    updateProfile.mutate({
      name,
      phone,
    });
  };

  if (isLoading) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  if (isError || !data) {
    return <p className="text-red-600">Unable to load profile.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <CustomerPageHeader
        title="My Profile"
        description="Manage your personal account information."
      />

      <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <User size={36} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {data.name}
          </h2>

          <p className="text-sm text-gray-500">{data.email}</p>

          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            <Shield size={13} />
            Customer
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Personal Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="customer-name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="customer-name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="customer-email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="customer-email"
                type="email"
                value={data.email}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="customer-phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>

            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="customer-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-5">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
            >
              <Save size={17} />
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {updateProfile.isError && (
            <p className="text-sm text-red-600">
              Unable to update your profile.
            </p>
          )}

          {updateProfile.isSuccess && (
            <p className="text-sm text-green-600">
              Profile updated successfully.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}