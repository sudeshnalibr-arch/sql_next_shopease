import { MapPin, Pencil, Trash2, Check } from "lucide-react";

import type { CustomerAddress } from "@/features/customer/addresses/address.types";

interface AddressCardProps {
  address: CustomerAddress;
  onEdit: (address: CustomerAddress) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="text-orange-500" size={20} />

          <h3 className="font-semibold text-gray-900">
            {address.label}
          </h3>
        </div>

        {address.isDefault && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Default
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1 text-sm text-gray-600">
        <p className="font-medium text-gray-900">
          {address.fullName}
        </p>
        <p>{address.phone}</p>
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.state} - {address.postalCode}
        </p>
        <p>{address.country}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
        <button
          onClick={() => onEdit(address)}
          className="flex items-center gap-1 text-sm font-medium text-blue-600"
        >
          <Pencil size={15} /> Edit
        </button>

        <button
          onClick={() => onDelete(address.id)}
          className="flex items-center gap-1 text-sm font-medium text-red-600"
        >
          <Trash2 size={15} /> Delete
        </button>

        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            className="flex items-center gap-1 text-sm font-medium text-green-600"
          >
            <Check size={15} /> Set Default
          </button>
        )}
      </div>
    </div>
  );
}