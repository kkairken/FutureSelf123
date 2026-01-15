"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

let toastQueue: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

export const toast = {
  success: (message: string) => addToast(message, "success"),
  error: (message: string) => addToast(message, "error"),
  info: (message: string) => addToast(message, "info"),
};

function addToast(message: string, type: Toast["type"]) {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast: Toast = { id, message, type };
  toastQueue = [...toastQueue, newToast];
  listeners.forEach((listener) => listener([...toastQueue]));

  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener([...toastQueue]));
  }, 5000);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`px-4 py-3 rounded-lg shadow-lg backdrop-blur-xl border ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-200"
                : toast.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-200"
                : "bg-blue-500/10 border-blue-500/20 text-blue-200"
            }`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
