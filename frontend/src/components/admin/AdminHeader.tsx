
"use client";

import { Bell, ChevronDown, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminHeader() {
  return (
    <motion.header
      initial={{ y: -15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white/95 px-5 backdrop-blur-md sm:px-8"
    >
      <div className="ml-10 lg:ml-0">
        <p className="text-xs text-gray-400">Welcome back</p>
        <h1 className="text-base font-bold text-gray-800">
          Admin Workspace
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 md:flex">
          <Search size={17} className="text-gray-400" />
          <input
            placeholder="Search..."
            className="w-36 bg-transparent text-sm outline-none"
          />
        </div>

        <button
          aria-label="Notifications"
          className="relative rounded-xl p-2 text-gray-500 hover:bg-gray-100"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
        </button>

        <button className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
            A
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-gray-800">
              Administrator
            </p>
            <p className="text-xs text-gray-400">Super Admin</p>
          </div>

          <ChevronDown size={16} className="hidden text-gray-400 sm:block" />
        </button>
      </div>
    </motion.header>
  );
}
