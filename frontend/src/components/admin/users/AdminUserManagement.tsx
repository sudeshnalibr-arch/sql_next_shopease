"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Pencil,
  UserRound,
  Users,
  UserCheck,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCog,
  UserX,
  AlertCircle,
} from "lucide-react";

import UserFormDialog from "./UserFormDialog";
import AssignManagerDialog from "./AssignManagerDialog";

import {
  useManagers,
  useStaff,
  useCreateManager,
  useUpdateManager,
  useCreateStaff,
  useUpdateStaff,
  useDeactivateStaff,
  useAssignStaffToManager,
} from "@/features/admin/users/user.queries";

import type {
  ManagedUser,
  UserFormValues,
} from "@/features/admin/users/user.types";

interface AdminUserManagementProps {
  mode: "manager" | "staff";
  currentRole: "admin" | "manager";
}

const PAGE_SIZE = 10;

export default function AdminUserManagement({
  mode,
  currentRole,
}: AdminUserManagementProps) {
  const isManagerPage = mode === "manager";
  const isAdmin = currentRole === "admin";

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [assigningUser, setAssigningUser] = useState<ManagedUser | null>(null);

  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const params = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: search.trim() || undefined,
    }),
    [page, search],
  );

  const managerQuery = useManagers(params);
  const staffQuery = useStaff(params);

  // Managers are also needed for Staff creation and assignment.
  const managerOptionsQuery = useManagers({
    page: 1,
    limit: 100,
  });

  const activeQuery = isManagerPage ? managerQuery : staffQuery;

  const users = activeQuery.data?.users ?? [];
  const pagination = activeQuery.data?.pagination;

  const managers = managerOptionsQuery.data?.users ?? [];

  const createManagerMutation = useCreateManager();
  const updateManagerMutation = useUpdateManager();
  const createStaffMutation = useCreateStaff();
  const updateStaffMutation = useUpdateStaff();
  const deactivateStaffMutation = useDeactivateStaff();
  const assignMutation = useAssignStaffToManager();

  const isSaving =
    createManagerMutation.isPending ||
    updateManagerMutation.isPending ||
    createStaffMutation.isPending ||
    updateStaffMutation.isPending;

  const isAssigning = assignMutation.isPending;

  const showForm = (user?: ManagedUser) => {
    setNotice(null);
    setEditingUser(user ?? null);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (isSaving) return;

    setFormOpen(false);
    setEditingUser(null);
  };

  const submitForm = async (values: UserFormValues) => {
    setNotice(null);

    try {
      if (isManagerPage) {
        if (editingUser) {
          await updateManagerMutation.mutateAsync({
            id: editingUser.id,
            payload: {
              name: values.name,
              email: values.email,
            },
          });

          setNotice({
            type: "success",
            message: "Manager updated successfully.",
          });
        } else {
          // await createManagerMutation.mutateAsync(values);

          if (!values.password) {
            throw new Error("Password is required.");
          }

          await createManagerMutation.mutateAsync({
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone,
          });

          setNotice({
            type: "success",
            message: "Manager created successfully.",
          });
        }
      } else {
        if (editingUser) {
          await updateStaffMutation.mutateAsync({
            id: editingUser.id,
            payload: {
              name: values.name,
              email: values.email,
            },
          });

          setNotice({
            type: "success",
            message: "Staff details updated successfully.",
          });
        } else {
          // await createStaffMutation.mutateAsync(values);
          if (!values.password) {
            throw new Error("Password is required.");
          }

          await createStaffMutation.mutateAsync({
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone,
            managerId: values.managerId ?? null,
          });

          setNotice({
            type: "success",
            message: "Staff member created successfully.",
          });
        }
      }

      setFormOpen(false);
      setEditingUser(null);
    } catch (error) {
      setNotice({
        type: "error",
        message: getErrorMessage(error),
      });
    }
  };

  const handleDeactivate = async (user: ManagedUser) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${user.name}? They will no longer be able to access their account.`,
    );

    if (!confirmed) return;

    setNotice(null);

    try {
      await deactivateStaffMutation.mutateAsync(user.id);

      setNotice({
        type: "success",
        message: "Staff account deactivated successfully.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: getErrorMessage(error),
      });
    }
  };

  const handleAssignManager = async (managerId: number) => {
    if (!assigningUser) return;

    setNotice(null);

    try {
      await assignMutation.mutateAsync({
        id: assigningUser.id,
        payload: {
          managerId,
        },
      });

      setAssigningUser(null);

      setNotice({
        type: "success",
        message: "Manager assigned successfully.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: getErrorMessage(error),
      });
    }
  };

  const refresh = () => {
    void activeQuery.refetch();
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              {isManagerPage ? <UserCog size={23} /> : <Users size={23} />}
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {isManagerPage ? "Manager Management" : "Staff Management"}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {isManagerPage
                  ? "Create and manage your store managers."
                  : "Manage staff members and their manager assignments."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={activeQuery.isFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={activeQuery.isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => showForm()}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            <Plus size={17} />
            Add {isManagerPage ? "Manager" : "Staff"}
          </button>
        </div>
      </motion.div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryCard
          label={`Total ${isManagerPage ? "Managers" : "Staff"}`}
          value={pagination?.total ?? users.length}
          icon={<Users size={20} />}
          color="orange"
        />

        <SummaryCard
          label="Active on this page"
          value={users.filter((user) => user.isActive).length}
          icon={<UserCheck size={20} />}
          color="emerald"
        />
      </div>

      {/* NOTIFICATIONS */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`rounded-xl border px-4 py-3 text-sm ${
              notice.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {notice.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder={
              isManagerPage
                ? "Search managers by name or email..."
                : "Search staff by name or email..."
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </motion.div>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {activeQuery.isLoading ? (
          <LoadingTable />
        ) : activeQuery.isError ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <AlertCircle size={34} className="text-red-500" />
            <h3 className="mt-4 font-semibold text-slate-800">
              Unable to load records
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {getErrorMessage(activeQuery.error)}
            </p>
            <button
              type="button"
              onClick={refresh}
              className="mt-5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <UserRound size={36} className="mx-auto text-slate-300" />
            <h3 className="mt-4 font-semibold text-slate-800">
              No {isManagerPage ? "managers" : "staff"} found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "Add your first record to get started."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Email</th>

                    {isManagerPage ? (
                      <th className="px-6 py-4 font-semibold">Manager ID</th>
                    ) : (
                      <th className="px-6 py-4 font-semibold">
                        Assigned Manager
                      </th>
                    )}

                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Joined</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user, index) => {
                    const assignedManager = managers.find(
                      (manager) => manager.id === user.managerId,
                    );

                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.035 }}
                        className="transition hover:bg-orange-50/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                              {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800">
                                {user.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                ID #{user.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {user.email}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {isManagerPage ? (
                            <span>#{user.id}</span>
                          ) : (
                            <div>
                              {assignedManager ? (
                                <>
                                  <p className="font-medium text-slate-700">
                                    {assignedManager.name}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    #{assignedManager.id}
                                  </p>
                                </>
                              ) : (
                                <span className="text-amber-600">
                                  Unassigned
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge active={user.isActive} />
                        </td>

                        <td className="px-6 py-4 text-slate-500">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-IN",
                              )
                            : "—"}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <ActionButton
                              label="Edit"
                              onClick={() => showForm(user)}
                            >
                              <Pencil size={15} />
                            </ActionButton>

                            {!isManagerPage && isAdmin && user.isActive && (
                              <ActionButton
                                label="Assign manager"
                                onClick={() => setAssigningUser(user)}
                              >
                                <UserCog size={16} />
                              </ActionButton>
                            )}

                            {!isManagerPage && user.isActive && (
                              <ActionButton
                                label="Deactivate"
                                danger
                                disabled={deactivateStaffMutation.isPending}
                                onClick={() => handleDeactivate(user)}
                              >
                                <UserX size={16} />
                              </ActionButton>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                Showing {users.length} of {pagination?.total ?? users.length}{" "}
                records
              </p>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  Page {page} of {pagination?.totalPages ?? 1}
                </span>

                <button
                  type="button"
                  disabled={page <= 1 || activeQuery.isFetching}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  type="button"
                  disabled={
                    page >= (pagination?.totalPages ?? 1) ||
                    activeQuery.isFetching
                  }
                  onClick={() =>
                    setPage((value) =>
                      Math.min(pagination?.totalPages ?? 1, value + 1),
                    )
                  }
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* CREATE / EDIT DIALOG */}
      <UserFormDialog
        open={formOpen}
        mode={mode}
        user={editingUser}
        managers={managers}
        currentRole={currentRole}
        loading={isSaving}
        onClose={closeForm}
        onSubmit={submitForm}
      />

      {/* ASSIGN MANAGER DIALOG */}
      <AssignManagerDialog
        open={Boolean(assigningUser)}
        staff={assigningUser}
        managers={managers}
        loading={isAssigning}
        onClose={() => {
          if (!isAssigning) setAssigningUser(null);
        }}
        onSubmit={handleAssignManager}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "orange" | "emerald";
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      </div>

      <div
        className={`rounded-xl p-3 ${
          color === "orange"
            ? "bg-orange-50 text-orange-600"
            : "bg-emerald-50 text-emerald-600"
        }`}
      >
        {icon}
      </div>
    </motion.div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function ActionButton({
  children,
  label,
  onClick,
  danger = false,
  disabled = false,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg border p-2 transition disabled:opacity-40 ${
        danger
          ? "border-red-100 text-red-500 hover:bg-red-50"
          : "border-slate-200 text-slate-500 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
      }`}
    >
      {children}
    </button>
  );
}

function LoadingTable() {
  return (
    <div className="space-y-4 p-6">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="h-14 animate-pulse rounded-xl bg-slate-100"
        />
      ))}
    </div>
  );
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error) return error.message;

  return "Something went wrong. Please try again.";
}
