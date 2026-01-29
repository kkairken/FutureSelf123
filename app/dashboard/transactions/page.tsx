"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { toast } from "@/components/Toaster";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  productType: string;
  creditsAdded: number;
  createdAt: string;
  pgOrderId: string | null;
};

export default function TransactionsPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const res = await fetch("/api/payments/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push("/auth/login");
            return;
          }
          throw new Error("Failed to fetch");
        }

        const data = await res.json();
        setPayments(data.payments || []);
      } catch (error) {
        toast.error(t.common.error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [router, t.common.error]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-400";
      case "pending":
        return "bg-yellow-500/10 text-yellow-400";
      case "failed":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return t.transactions.statusCompleted;
      case "pending":
        return t.transactions.statusPending;
      case "failed":
        return t.transactions.statusFailed;
      default:
        return status;
    }
  };

  const getProductName = (productType: string) => {
    switch (productType) {
      case "1_chapter":
        return t.transactions.product7;
      case "5_chapters":
        return t.transactions.product20;
      case "10_chapters":
        return t.transactions.product40;
      case "subscription_100":
        return t.transactions.product100;
      default:
        return productType;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    // amount is in cents/tiyn, convert to main currency unit
    const mainAmount = amount / 100;
    const symbols: Record<string, string> = {
      KZT: "₸",
      USD: "$",
      EUR: "€",
    };
    const symbol = symbols[currency] || "";
    // Use fixed formatting to avoid hydration mismatch
    const formatted = mainAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${symbol}${formatted}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">💳</div>
          <h2 className="text-2xl font-bold">{t.common.loading}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="secondary" size="sm">
                ← {t.transactions.backToDashboard}
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">{t.transactions.title}</h1>
          <p className="text-foreground/70 mt-2">{t.transactions.subtitle}</p>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {payments.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold mb-2">{t.transactions.noTransactions}</h3>
              <p className="text-foreground/70 mb-6">{t.transactions.noTransactionsDesc}</p>
              <Link href="/pricing">
                <Button>{t.transactions.buyCredits}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment, i) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 bg-card border border-border rounded-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold">{getProductName(payment.productType)}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusText(payment.status)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground/60">
                        <span>
                          {new Date(payment.createdAt).toLocaleDateString(locale, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {payment.pgOrderId && (
                          <span className="font-mono text-xs">
                            #{payment.pgOrderId.slice(-8)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-accent">
                        {formatAmount(payment.amount, payment.currency)}
                      </div>
                      {payment.status === "completed" && payment.creditsAdded > 0 && (
                        <div className="text-sm text-green-400">
                          +{payment.creditsAdded} {t.transactions.credits}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Footer note */}
        {payments.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-foreground/50 mt-8"
          >
            {t.transactions.securePayment}
          </motion.p>
        )}
      </div>
    </div>
  );
}
