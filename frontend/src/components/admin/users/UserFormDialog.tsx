
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, X } from "lucide-react";

import type {
  ManagedUser,
  UserFormValues,
} from "@/features/admin/users/user.types";

interface UserFormDialogProps {
  open: boolean;
  mode: "manager" | "staff";
  user?: ManagedUser | null;
  managers?: ManagedUser[];
  currentRole: "admin" | "manager";
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
}

export default function UserFormDialog({
  open,
  mode,
  user,
  managers = [],
  currentRole,
  loading = false,
  onClose,
  onSubmit,
}: UserFormDialogProps) {
  const isEdit = Boolean(user);
  const isStaff = mode === "staff";
  const isAdmin = currentRole === "admin";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [managerId, setManagerId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;

    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setPassword("");
    setManagerId(user?.managerId ? String(user.managerId) : "");
    setErrors({});
    setShowPassword(false);
  }, [open, user]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (name.trim().length < 2) {
      nextErrors.name = "Name must contain at least 2 characters.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!isEdit) {
      if (!password) {
        nextErrors.password = "Password is required.";
      } else if (password.length < 8) {
        nextErrors.password = "Password must contain at least 8 characters.";
      } else if (password.length > 72) {
        nextErrors.password = "Password cannot exceed 72 characters.";
      }
    }

    if (isStaff && isAdmin && !managerId) {
      nextErrors.managerId = "Please assign this staff member to a manager.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    const values: UserFormValues = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };

    if (!isEdit) {
      values.password = password;
    }

    if (isStaff && isAdmin && !isEdit) {
      values.managerId = Number(managerId);
    }

    onSubmit(values);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !loading) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-dialog-title"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2
                  id="user-dialog-title"
                  className="text-lg font-bold text-slate-900"
                >
                  {isEdit ? "Edit" : "Create"}{" "}
                  {isStaff ? "Staff Member" : "Manager"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {isEdit
                    ? "Update account information."
                    : "Enter the account details below."}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Close dialog"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter full name"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-orange-100 ${
                    errors.name
                      ? "border-red-400"
                      : "border-slate-200 focus:border-orange-400"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="example@shopease.com"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-orange-100 ${
                    errors.email
                      ? "border-red-400"
                      : "border-slate-200 focus:border-orange-400"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {!isEdit && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Temporary Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Minimum 8 characters"
                      className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm outline-none transition focus:ring-2 focus:ring-orange-100 ${
                        errors.password
                          ? "border-red-400"
                          : "border-slate-200 focus:border-orange-400"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>
              )}

              {isStaff && isAdmin && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Assign Manager
                  </label>

                  <select
                    value={managerId}
                    onChange={(event) => setManagerId(event.target.value)}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${
                      errors.managerId ? "border-red-400" : "border-slate-200"
                    }`}
                  >
                    <option value="">Select a manager</option>

                    {managers
                      .filter((manager) => manager.isActive)
                      .map((manager) => (
                        <option key={manager.id} value={manager.id}>
                          {manager.name} (#{manager.id})
                        </option>
                      ))}
                  </select>

                  {errors.managerId && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.managerId}
                    </p>
                  )}

                  {managers.length === 0 && (
                    <p className="mt-1 text-xs text-amber-600">
                      No managers found. Create a manager first.
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : isEdit
                      ? "Save Changes"
                      : `Create ${isStaff ? "Staff" : "Manager"}`}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
