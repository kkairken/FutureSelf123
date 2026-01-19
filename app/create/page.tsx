"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Select } from "@/components/Select";
import { toast } from "@/components/Toaster";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { formatString } from "@/lib/i18n/format";

export default function CreateChapterPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
          } else {
            setNeedsAuth(true);
          }
        })
        .catch(() => setNeedsAuth(true));
    } else {
      setNeedsAuth(true);
    }
  }, []);

  const [formData, setFormData] = useState({
    bookTitle: "",
    name: "",
    currentLife: "",
    pastEvents: "",
    fears: "",
    futureVision: "",
    archetype: "creator",
    tone: "powerful",
  });

  const archetypeOptions = [
    { value: "creator", label: t.archetypes.creator },
    { value: "leader", label: t.archetypes.leader },
    { value: "sage", label: t.archetypes.sage },
    { value: "rebel", label: t.archetypes.rebel },
    { value: "lover", label: t.archetypes.lover },
    { value: "hero", label: t.archetypes.hero },
    { value: "magician", label: t.archetypes.magician },
    { value: "explorer", label: t.archetypes.explorer },
  ];

  const toneOptions = [
    { value: "calm", label: t.tones.calm },
    { value: "powerful", label: t.tones.powerful },
    { value: "philosophical", label: t.tones.philosophical },
    { value: "triumphant", label: t.tones.triumphant },
  ];

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error(t.create.signInFirst);
      return;
    }

    if (user.credits < 1) {
      toast.error(t.create.needCredits);
      router.push("/pricing");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/chapters/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, language: locale }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t.create.generating);
        router.push(`/chapter/${data.chapterId}`);
      } else {
        toast.error(data.error || t.common.error);
      }
    } catch (error) {
      toast.error(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-4 animate-pulse">✨</div>
          <h2 className="text-2xl font-bold mb-2">{t.create.generating}</h2>
          <p className="text-foreground/70">{t.create.timeEstimate}</p>
        </motion.div>
      </div>
    );
  }

  if (needsAuth) {
    return <AuthPrompt />;
  }

  return (
    <div className="min-h-screen py-16 sm:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.create.title}</h1>
          <p className="text-foreground/70 text-lg">{t.create.subtitle}</p>
          {user && (
            <p className="mt-4 text-accent">
              {formatString(t.create.creditsRemaining, { credits: user.credits })}
            </p>
          )}
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <Input
            label={t.create.form.bookTitle}
            name="bookTitle"
            value={formData.bookTitle}
            onChange={handleChange}
            placeholder={t.create.form.bookTitlePlaceholder}
          />

          <Input
            label={t.create.form.name}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t.create.form.namePlaceholder}
            required
          />

          <Textarea
            label={t.create.form.currentLife}
            name="currentLife"
            value={formData.currentLife}
            onChange={handleChange}
            placeholder={t.create.form.currentLifePlaceholder}
            rows={4}
            required
          />

          <Textarea
            label={t.create.form.pastEvents}
            name="pastEvents"
            value={formData.pastEvents}
            onChange={handleChange}
            placeholder={t.create.form.pastEventsPlaceholder}
            rows={4}
            required
          />

          <Textarea
            label={t.create.form.fears}
            name="fears"
            value={formData.fears}
            onChange={handleChange}
            placeholder={t.create.form.fearsPlaceholder}
            rows={4}
            required
          />

          <Textarea
            label={t.create.form.futureVision}
            name="futureVision"
            value={formData.futureVision}
            onChange={handleChange}
            placeholder={t.create.form.futureVisionPlaceholder}
            rows={6}
            required
          />

          <Select
            label={t.create.form.archetype}
            name="archetype"
            value={formData.archetype}
            onChange={handleChange}
            options={archetypeOptions}
          />

          <Select
            label={t.create.form.tone}
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            options={toneOptions}
          />

          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {loading ? t.create.generating : t.create.generate}
            </Button>
          </div>

          <p className="text-sm text-foreground/60 text-center">
            {t.create.timeEstimate}
          </p>
        </motion.form>
      </div>
    </div>
  );
}

function AuthPrompt() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { t } = useLanguage();

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSent(true);
        toast.success(t.auth.signIn.checkEmail);
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
        <h2 className="text-3xl font-bold mb-4 text-center">{t.auth.signIn.title}</h2>
        <p className="text-foreground/70 text-center mb-8">{t.auth.signIn.subtitle}</p>

        {sent ? (
          <div className="text-center">
            <div className="text-4xl mb-4">✉️</div>
            <p className="text-lg">{t.auth.signIn.checkEmail}</p>
            <p className="text-sm text-foreground/60 mt-2">
              {t.auth.signIn.clickLink}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <Input
              type="email"
              label={t.auth.signIn.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.auth.signIn.emailPlaceholder}
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              {loading ? t.common.loading : t.auth.signIn.sendLink}
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
        )}
      </motion.div>
    </div>
  );
}
