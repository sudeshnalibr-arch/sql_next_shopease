"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import CustomerPageHeader from "@/components/customer/CustomerPageHeader";
import AddressCard from "@/components/customer/AddressCard";
import AddressFormDialog from "@/components/customer/AddressFormDialog";

import {
  useCustomerAddresses,
  useCreateCustomerAddress,
  useUpdateCustomerAddress,
  useDeleteCustomerAddress,
  useSetDefaultCustomerAddress,
} from "@/features/customer/addresses/address.queries";

import type {
  CustomerAddress,
  AddressPayload,
} from "@/features/customer/addresses/address.types";

export default function CustomerAddressesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<CustomerAddress | null>(null);

  const { data, isLoading, isError } = useCustomerAddresses();

  const createAddress = useCreateCustomerAddress();
  const updateAddress = useUpdateCustomerAddress();
  const deleteAddress = useDeleteCustomerAddress();
  const setDefaultAddress = useSetDefaultCustomerAddress();

  const isPending =
    createAddress.isPending || updateAddress.isPending;

  const handleSubmit = (payload: AddressPayload) => {
    if (selectedAddress) {
      updateAddress.mutate(
        {
          id: selectedAddress.id,
          payload,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setSelectedAddress(null);
          },
        }
      );
    } else {
      createAddress.mutate(payload, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  const handleEdit = (address: CustomerAddress) => {
    setSelectedAddress(address);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedAddress(null);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      deleteAddress.mutate(id);
    }
  };

  if (isLoading) {
    return <p className="text-gray-500">Loading addresses...</p>;
  }

  if (isError) {
    return <p className="text-red-600">Unable to load addresses.</p>;
  }

  return (
    <div>
      <CustomerPageHeader
        title="My Addresses"
        description="Manage your delivery addresses."
        action={
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600"
          >
            <Plus size={17} />
            Add Address
          </button>
        }
      />

      {data?.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {data.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={(id) => setDefaultAddress.mutate(id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-gray-800">
            You haven't saved any addresses.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Add an address to make checkout easier.
          </p>
        </div>
      )}

      <AddressFormDialog
        open={dialogOpen}
        address={selectedAddress}
        onClose={() => {
          setDialogOpen(false);
          setSelectedAddress(null);
        }}
        onSubmit={handleSubmit}
        isPending={isPending}
      />

      {deleteAddress.isError && (
        <p className="mt-4 text-sm text-red-600">
          Unable to delete address.
        </p>
      )}

      {setDefaultAddress.isError && (
        <p className="mt-4 text-sm text-red-600">
          Unable to set default address.
        </p>
      )}
    </div>
  );
}