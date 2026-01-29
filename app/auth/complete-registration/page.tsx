"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { toast } from "@/components/Toaster";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Locale } from "@/lib/i18n/dictionaries";

function CompleteRegistrationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, setLocale, locale } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    language: locale as Locale,
  });

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    setTokenValid(true);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(t.auth.completeRegistration.nameRequired);
      return;
    }

    if (formData.password.length < 6) {
      toast.error(t.auth.completeRegistration.passwordMin);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t.auth.completeRegistration.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          name: formData.name,
          password: formData.password,
          language: formData.language,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("auth_token", data.token);
        setLocale(formData.language);
        toast.success(t.common.success);
        // Full page reload to update Header state
        window.location.href = "/dashboard";
      } else {
        if (data.error === "Invalid or expired token") {
          toast.error(t.auth.verify.expired);
          setTokenValid(false);
        } else {
          toast.error(data.error || t.common.error);
        }
      }
    } catch {
      toast.error(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🔐</div>
          <h1 className="text-2xl font-bold">{t.common.loading}</h1>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">{t.auth.verify.failed}</h1>
          <p className="text-foreground/70 mb-6">{t.auth.verify.expired}</p>
          <button
            onClick={() => router.push("/auth/register")}
            className="px-6 py-3 bg-accent hover:bg-accent-dark rounded-lg transition-colors"
          >
            {t.auth.verify.tryAgain}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 bg-card border border-border rounded-2xl"
      >
        <h2 className="text-3xl font-bold mb-2 text-center">
          {t.auth.completeRegistration.title}
        </h2>
        <p className="text-foreground/70 text-center mb-8">
          {t.auth.completeRegistration.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t.auth.complete.fullName}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t.auth.complete.namePlaceholder}
            required
          />

          <Input
            label={t.auth.login.password}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder={t.auth.completeRegistration.passwordPlaceholder}
            required
          />

          <Input
            label={t.auth.completeRegistration.confirmPassword}
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder={t.auth.completeRegistration.confirmPasswordPlaceholder}
            required
          />

          <Select
            label={t.auth.complete.language}
            value={formData.language}
            onChange={(e) => {
              const lang = e.target.value as Locale;
              setFormData({ ...formData, language: lang });
              setLocale(lang);
            }}
            options={[
              { value: "en", label: t.languages.en },
              { value: "ru", label: t.languages.ru },
              { value: "kz", label: t.languages.kz },
            ]}
          />

          <Button type="submit" loading={loading} className="w-full">
            {t.auth.completeRegistration.submit}
          </Button>

          <p className="text-xs text-foreground/60 text-center leading-relaxed">
            {t.auth.complete.consentPrefix}{" "}
            <a href="/offer" className="underline hover:text-accent">
              {t.auth.complete.consentOffer}
            </a>
            ,{" "}
            <a href="/privacy" className="underline hover:text-accent">
              {t.auth.complete.consentPrivacy}
            </a>{" "}
            {t.languages.ru === "Русский" ? "и" : "and"}{" "}
            <a href="/terms" className="underline hover:text-accent">
              {t.auth.complete.consentTerms}
            </a>
            .
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default function CompleteRegistrationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-pulse">🔐</div>
      </div>
    }>
      <CompleteRegistrationClient />
    </Suspense>
  );
}
