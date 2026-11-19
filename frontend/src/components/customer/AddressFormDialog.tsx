"use client";

import { useEffect, useState } from "react";

import type {
  CustomerAddress,
  AddressPayload,
} from "@/features/customer/addresses/address.types";

interface AddressFormDialogProps {
  open: boolean;
  address: CustomerAddress | null;
  onClose: () => void;
  onSubmit: (payload: AddressPayload) => void;
  isPending?: boolean;
}

const emptyForm: AddressPayload = {
  label: "Home",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

export default function AddressFormDialog({
  open,
  address,
  onClose,
  onSubmit,
  isPending = false,
}: AddressFormDialogProps) {
  const [form, setForm] = useState<AddressPayload>(emptyForm);

  useEffect(() => {
    if (address) {
      setForm({
        label: address.label,
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 ?? "",
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        isDefault: address.isDefault,
      });
    } else {
      setForm(emptyForm);
    }
  }, [address, open]);

  if (!open) return null;

  const updateField = (
    field: keyof AddressPayload,
    value: string | boolean
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {address ? "Edit Address" : "Add New Address"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="Address label (Home, Work)"
              value={form.label}
              onChange={(e) => updateField("label", e.target.value)}
              className="rounded-lg border p-3"
            />

            <input
              required
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="rounded-lg border p-3"
            />

            <input
              required
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="rounded-lg border p-3"
            />

            <input
              required
              placeholder="Address line 1"
              value={form.addressLine1}
              onChange={(e) => updateField("addressLine1", e.target.value)}
              className="rounded-lg border p-3"
            />

            <input
              placeholder="Address line 2 (optional)"
              value={form.addressLine2 ?? ""}
              onChange={(e) => updateField("addressLine2", e.target.value)}
              className="rounded-lg border p-3"
            />

            <input
              required
              placeholder="City"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className="rounded-lg border p-3"
            />

            <input
              required
              placeholder="State"
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              className="rounded-lg border p-3"
            />

            <input
              required
              placeholder="Postal code"
              value={form.postalCode}
              onChange={(e) => updateField("postalCode", e.target.value)}
              className="rounded-lg border p-3"
            />

            <input
              required
              placeholder="Country"
              value={form.country}
              onChange={(e) => updateField("country", e.target.value)}
              className="rounded-lg border p-3"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => updateField("isDefault", e.target.checked)}
            />
            Make this my default address
          </label>

          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}