
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Store,
  Bell,
  ShieldCheck,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("ShopEase");
  const [storeEmail, setStoreEmail] = useState("support@shopease.com");
  const [storePhone, setStorePhone] = useState("");
  const [currency, setCurrency] = useState("INR");

  const [orderNotifications, setOrderNotifications] = useState(true);
  const [stockNotifications, setStockNotifications] = useState(true);
  const [customerNotifications, setCustomerNotifications] = useState(false);

  const handleSave = () => {
    // Connect this handler to your settings API.
    alert("Settings UI is ready. Connect your settings API to save changes.");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-slate-900">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your store configuration and admin preferences.
        </p>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <Store size={21} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                Store Information
              </h2>
              <p className="text-xs text-slate-500">
                Basic details about your store
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <Field
              label="Store Name"
              value={storeName}
              onChange={setStoreName}
            />

            <Field
              label="Support Email"
              type="email"
              value={storeEmail}
              onChange={setStoreEmail}
            />

            <Field
              label="Contact Number"
              value={storePhone}
              onChange={setStorePhone}
              placeholder="Enter contact number"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Currency
              </label>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="INR">Indian Rupee (INR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Bell size={21} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                Notifications
              </h2>
              <p className="text-xs text-slate-500">
                Choose which updates you want to receive
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <Toggle
              label="New order notifications"
              description="Receive updates when customers place orders."
              checked={orderNotifications}
              onChange={setOrderNotifications}
            />

            <Toggle
              label="Low stock notifications"
              description="Get notified when product stock is low."
              checked={stockNotifications}
              onChange={setStockNotifications}
            />

            <Toggle
              label="Customer notifications"
              description="Receive updates about customer activity."
              checked={customerNotifications}
              onChange={setCustomerNotifications}
            />
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <ShieldCheck className="shrink-0 text-emerald-600" size={22} />
            <p className="text-xs leading-5 text-slate-600">
              Keep your administrator credentials secure. Never expose
              secret keys or passwords in frontend code.
            </p>
          </div>
        </motion.section>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <Save size={17} />
          Save Settings
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      />
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-orange-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
