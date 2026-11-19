
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Inbox,
} from "lucide-react";

import axiosInstance from "@/lib/axiosInstance";

export interface ResourceColumn {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface AdminResourcePageProps {
  title: string;
  description: string;
  endpoint: string;
  columns: ResourceColumn[];
  searchPlaceholder?: string;
  pageSize?: number;
}

interface ResourceResponse {
  rows: Record<string, unknown>[];
  total: number;
}

function getResourceData(response: unknown): ResourceResponse {
  const result = response as {
    data?: {
      data?: unknown;
      pagination?: {
        total?: number;
        totalItems?: number;
      };
      total?: number;
    };
  };

  const payload = result?.data?.data;

  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { rows?: unknown[] })?.rows)
      ? (payload as { rows: unknown[] }).rows
      : Array.isArray((payload as { users?: unknown[] })?.users)
        ? (payload as { users: unknown[] }).users
        : [];

  const total =
    result?.data?.pagination?.total ??
    result?.data?.pagination?.totalItems ??
    result?.data?.total ??
    rows.length;

  return {
    rows: rows as Record<string, unknown>[],
    total,
  };
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export default function AdminResourcePage({
  title,
  description,
  endpoint,
  columns,
  searchPlaceholder = "Search...",
  pageSize = 10,
}: AdminResourcePageProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin-resource", endpoint, search, page, pageSize],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoint, {
        params: {
          search: search.trim() || undefined,
          page,
          limit: pageSize,
        },
      });

      return getResourceData(response);
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <p className="text-sm text-slate-500">
            Total records:{" "}
            <span className="font-semibold text-slate-800">
              {total}
            </span>
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {isLoading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <AlertCircle size={34} className="text-red-500" />
            <h3 className="mt-4 font-semibold text-slate-800">
              Unable to load {title.toLowerCase()}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Check your API endpoint and authentication, then try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Try again
            </button>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Inbox size={36} className="text-slate-300" />
            <h3 className="mt-4 font-semibold text-slate-800">
              No records found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try changing your search."
                : `There are no ${title.toLowerCase()} to display yet.`}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="whitespace-nowrap px-6 py-4 font-semibold"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {rows.map((row, index) => (
                    <motion.tr
                      key={String(row.id ?? row.email ?? index)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.025 }}
                      className="transition hover:bg-orange-50/40"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="whitespace-nowrap px-6 py-4 text-slate-700"
                        >
                          {column.render
                            ? column.render(row[column.key], row)
                            : formatValue(row[column.key])}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                Page {page} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={page >= totalPages}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
