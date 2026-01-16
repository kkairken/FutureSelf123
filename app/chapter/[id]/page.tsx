"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { toast } from "@/components/Toaster";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { formatString } from "@/lib/i18n/format";

export const runtime = "edge";

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const archetypeLabels: Record<string, string> = {
    creator: t.archetypes.creator,
    leader: t.archetypes.leader,
    sage: t.archetypes.sage,
    rebel: t.archetypes.rebel,
    lover: t.archetypes.lover,
    hero: t.archetypes.hero,
    magician: t.archetypes.magician,
    explorer: t.archetypes.explorer,
  };

  const toneLabels: Record<string, string> = {
    calm: t.tones.calm,
    powerful: t.tones.powerful,
    philosophical: t.tones.philosophical,
    triumphant: t.tones.triumphant,
  };

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          router.push("/create");
          return;
        }

        const res = await fetch(`/api/chapters/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setChapter(data.chapter);

          // Poll if still generating
          if (data.chapter.status === "pending" || data.chapter.status === "generating") {
            setTimeout(fetchChapter, 3000);
          }
        } else {
          toast.error(data.error || t.common.error);
          router.push("/dashboard");
        }
      } catch (error) {
        toast.error(t.common.error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [params.id, router]);

  if (loading || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">✨</div>
          <h2 className="text-2xl font-bold">{t.chapter.loading}</h2>
        </div>
      </div>
    );
  }

  if (chapter.status === "generating" || chapter.status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-6"
          >
            ✨
          </motion.div>
          <h1 className="text-3xl font-bold mb-4">{t.chapter.creating}</h1>
          <p className="text-foreground/70 mb-2">
            {t.chapter.creatingDesc}
          </p>
          <p className="text-sm text-accent">{t.chapter.timeEstimate}</p>
        </motion.div>
      </div>
    );
  }

  if (chapter.status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">{t.chapter.failed}</h1>
          <p className="text-foreground/70 mb-6">{t.chapter.failedDesc}</p>
          <Button onClick={() => router.push("/create")}>{t.chapter.tryAgain}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            ← {t.chapter.backToDashboard}
          </Button>
        </motion.div>

        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <div className="mb-12 text-center border-b border-border pb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              {formatString(t.chapter.title, { name: chapter.name })}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-foreground/60">
              <span>
                {t.dashboard.chapters.archetype}: {archetypeLabels[chapter.archetype] || chapter.archetype}
              </span>
              <span>•</span>
              <span>
                {t.dashboard.chapters.tone}: {toneLabels[chapter.tone] || chapter.tone}
              </span>
              <span>•</span>
              <span>{new Date(chapter.createdAt).toLocaleDateString(locale)}</span>
            </div>
          </div>

          <div className="font-serif text-lg leading-relaxed whitespace-pre-wrap bg-card border border-border rounded-2xl p-8 md:p-12">
            {chapter.content}
          </div>
        </motion.article>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-foreground/70 mb-6">{t.chapter.readDaily}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push("/create")}>
              {t.chapter.createAnother}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(chapter.content);
                toast.success(t.chapter.copied);
              }}
            >
              {t.chapter.copyText}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
