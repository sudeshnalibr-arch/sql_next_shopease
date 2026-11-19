
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users, X } from "lucide-react";

import type { ManagedUser } from "@/features/admin/users/user.types";

interface AssignManagerDialogProps {
  open: boolean;
  staff: ManagedUser | null;
  managers: ManagedUser[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (managerId: number) => void;
}

export default function AssignManagerDialog({
  open,
  staff,
  managers,
  loading = false,
  onClose,
  onSubmit,
}: AssignManagerDialogProps) {
  const [managerId, setManagerId] = useState("");

  useEffect(() => {
    if (open) {
      setManagerId(staff?.managerId ? String(staff.managerId) : "");
    }
  }, [open, staff]);

  return (
    <AnimatePresence>
      {open && staff && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
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
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                  <Users size={21} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Assign Manager
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Select a manager for {staff.name}.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Manager
              </label>

              <select
                value={managerId}
                onChange={(event) => setManagerId(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
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

              {managers.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  There are no active managers available.
                </p>
              )}
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!managerId || loading}
                onClick={() => onSubmit(Number(managerId))}
                className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Assigning..." : "Assign Manager"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
