"use client";

import { useEffect, useState } from "react";

export interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let toastId = 0;
const listeners = new Set<(toast: ToastItem) => void>();

export function showToast(message: string, type: ToastItem["type"] = "success") {
  const toast = { id: ++toastId, message, type };
  listeners.forEach((fn) => fn(toast));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (toast: ToastItem) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const styles = {
    success: "bg-emerald-500/90 border-emerald-400",
    error: "bg-red-500/90 border-red-400",
    info: "bg-cyan-500/90 border-cyan-400",
  };

  const icons = { success: "✅", error: "❌", info: "ℹ️" };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-white text-sm font-medium shadow-lg backdrop-blur-md animate-[slideIn_0.3s_ease-out] ${styles[toast.type]}`}
        >
          <span>{icons[toast.type]}</span>
          {toast.message}
        </div>
      ))}

    </div>
  );
}
