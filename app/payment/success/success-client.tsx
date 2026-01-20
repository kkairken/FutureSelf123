"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { toast } from "@/components/Toaster";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PaymentSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [creditsAdded, setCreditsAdded] = useState<number | null>(null);

  useEffect(() => {
    const statusParam = searchParams.get("status");
    const orderId = searchParams.get("pg_order_id");
    const paymentId = searchParams.get("pg_payment_id");

    if (statusParam === "failed") {
      setStatus("error");
      return;
    }

    // If success, try to apply credits via API
    if (statusParam === "success" && (orderId || paymentId)) {
      const token = localStorage.getItem("auth_token");
      if (token) {
        // Call API to complete payment and apply credits
        fetch("/api/v1/payments/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_id: orderId,
            payment_id: paymentId,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Payment status response:", data);
            if (data.creditsAdded) {
              setCreditsAdded(data.creditsAdded);
            }
            setStatus("success");
            toast.success(t.payment.successTitle);
          })
          .catch((err) => {
            console.error("Failed to apply credits:", err);
            setStatus("success"); // Still show success, credits might be applied via callback
            toast.success(t.payment.successTitle);
          });
      } else {
        setStatus("success");
        toast.success(t.payment.successTitle);
      }
    } else {
      setStatus("success");
      toast.success(t.payment.successTitle);
    }
  }, [searchParams, t.payment.successTitle]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        {status === "loading" && (
          <>
            <div className="text-6xl mb-4 animate-pulse">💳</div>
            <h1 className="text-2xl font-bold">{t.payment.processing}</h1>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-4">{t.payment.successTitle}</h1>
            <p className="text-foreground/70 mb-8">
              {t.payment.successBody}
              {creditsAdded && (
                <span className="block mt-2 text-green-500 font-semibold">
                  +{creditsAdded} credits
                </span>
              )}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/create")}>
                {t.payment.createChapter}
              </Button>
              <Button variant="secondary" onClick={() => router.push("/dashboard")}>
                {t.payment.goDashboard}
              </Button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-4">{t.payment.failedTitle}</h1>
            <p className="text-foreground/70 mb-8">{t.payment.failedBody}</p>
            <Button onClick={() => router.push("/pricing")}>
              {t.payment.tryAgain}
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}
