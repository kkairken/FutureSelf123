"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { toast } from "@/components/Toaster";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setStatus("error");
      return;
    }

    fetch("/api/stripe/success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          toast.success(t.payment.successTitle);
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, [searchParams]);

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
            <p className="text-foreground/70 mb-8">{t.payment.successBody}</p>
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
