"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { toast } from "@/components/Toaster";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { t, setLocale } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error(t.common.error);
      return;
    }

    if (!password || password.length < 6) {
      toast.error(t.auth.login.passwordRequired);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("auth_token", data.token);
        if (data.user.language) {
          setLocale(data.user.language);
        }
        toast.success(t.auth.verify.welcomeBack);
        // Full page reload to update Header state
        window.location.href = "/dashboard";
      } else {
        toast.error(t.auth.login.invalidCredentials);
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
        <h2 className="text-3xl font-bold mb-2 text-center">{t.auth.login.title}</h2>
        <p className="text-foreground/70 text-center mb-8">
          {t.auth.login.subtitle}
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

          <Input
            label={t.auth.login.password}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.auth.login.passwordPlaceholder}
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            {t.auth.login.submit}
          </Button>
        </form>

        <p className="text-sm text-foreground/60 text-center mt-6">
          {t.auth.login.noAccount}{" "}
          <Link href="/auth/register" className="text-accent hover:underline">
            {t.auth.login.registerLink}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
