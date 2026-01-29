"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { toast } from "@/components/Toaster";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function RegisterPage() {
  const { t, locale } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error(t.common.error);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      const data = await res.json();

      if (res.ok) {
        setSent(true);
        toast.success(t.auth.register.checkEmail);
      } else {
        if (data.error === "User already exists") {
          toast.error(t.auth.register.userExists);
        } else {
          toast.error(t.common.error);
        }
      }
    } catch {
      toast.error(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 bg-card border border-border rounded-2xl"
      >
        {!sent ? (
          <>
            <h2 className="text-3xl font-bold mb-2 text-center">{t.auth.register.title}</h2>
            <p className="text-foreground/70 text-center mb-8">
              {t.auth.register.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={t.auth.signIn.email}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth.signIn.emailPlaceholder}
                required
              />

              <Button type="submit" loading={loading} className="w-full">
                {t.auth.register.sendLink}
              </Button>
            </form>

            <p className="text-sm text-foreground/60 text-center mt-6">
              {t.auth.register.haveAccount}{" "}
              <Link href="/auth/login" className="text-accent hover:underline">
                {t.auth.register.loginLink}
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-bold mb-2">{t.auth.register.checkEmail}</h2>
            <p className="text-foreground/70 mb-2">
              {t.auth.register.clickLink}
            </p>
            <p className="text-sm text-foreground/50">
              {t.auth.signIn.checkSpam}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
