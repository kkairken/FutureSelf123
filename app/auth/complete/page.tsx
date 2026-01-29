"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { toast } from "@/components/Toaster";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Locale } from "@/lib/i18n/dictionaries";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { t, setLocale } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    language: "en" as Locale,
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/create");
      return;
    }

    // Check if user already has a name
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user.name) {
          // Already completed
          router.push("/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(t.common.error);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setLocale(formData.language);
        toast.success(t.common.success);
        // Full page reload to update Header state
        window.location.href = "/dashboard";
      } else {
        toast.error(t.common.error);
      }
    } catch (error) {
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
        <h2 className="text-3xl font-bold mb-2 text-center">{t.auth.complete.title}</h2>
        <p className="text-foreground/70 text-center mb-8">
          {t.auth.complete.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t.auth.complete.fullName}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t.auth.complete.namePlaceholder}
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
            {t.auth.complete.complete}
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
            и{" "}
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
