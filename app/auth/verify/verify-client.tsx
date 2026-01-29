"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "@/components/Toaster";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function VerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [nextRoute, setNextRoute] = useState<string | null>(null);
  const [nextLabel, setNextLabel] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("auth_token", data.token);
          setStatus("success");

          if (!data.user.name) {
            toast.success(t.auth.verify.welcomeNew);
            setNextRoute("/auth/complete");
            setNextLabel(t.auth.verify.completeProfile);
            setTimeout(() => {
              window.location.href = "/auth/complete";
            }, 1000);
          } else {
            toast.success(t.auth.verify.welcomeBack);
            setNextRoute("/dashboard");
            setNextLabel(t.auth.verify.goToDashboard);
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1000);
          }
        } else {
          setStatus("error");
          toast.error(data.error || t.common.error);
        }
      })
      .catch(() => {
        setStatus("error");
        toast.error(t.common.error);
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {status === "loading" && (
          <>
            <div className="text-6xl mb-4 animate-pulse">🔐</div>
            <h1 className="text-2xl font-bold">{t.auth.verify.verifying}</h1>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold mb-2">{t.auth.verify.success}</h1>
            <p className="text-foreground/70">{t.auth.verify.redirecting}</p>
            {nextRoute && (
              <button
                onClick={() => window.location.href = nextRoute}
                className="mt-6 px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors"
              >
                {nextLabel}
              </button>
            )}
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-2">{t.auth.verify.failed}</h1>
            <p className="text-foreground/70 mb-6">{t.auth.verify.expired}</p>
            <button
              onClick={() => router.push("/create")}
              className="px-6 py-3 bg-accent hover:bg-accent-dark rounded-lg transition-colors"
            >
              {t.auth.verify.tryAgain}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
