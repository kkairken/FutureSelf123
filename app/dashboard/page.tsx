"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { toast } from "@/components/Toaster";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function DashboardPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
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
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          router.push("/create");
          return;
        }

        // Fetch user
        const userRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userRes.json();

        if (!userData.user) {
          router.push("/create");
          return;
        }

        setUser(userData.user);

        // Fetch chapters
        const chaptersRes = await fetch("/api/chapters/list", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const chaptersData = await chaptersRes.json();

        if (chaptersRes.ok) {
          setChapters(chaptersData.chapters || []);
        }
      } catch (error) {
        toast.error(t.common.error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">📚</div>
            <h2 className="text-2xl font-bold">{t.dashboard.loading}</h2>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            {user?.name ? `${t.dashboard.welcomeBack}, ${user.name}` : t.dashboard.welcome}
          </h1>
          <p className="text-foreground/70">{t.dashboard.tagline}</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="text-3xl font-bold text-accent mb-2">
              {user?.credits || 0}
            </div>
            <div className="text-sm text-foreground/70">{t.dashboard.stats.creditsRemaining}</div>
            {user?.credits === 0 && (
              <Link href="/pricing">
                <Button size="sm" className="mt-4 w-full">
                  {t.dashboard.stats.buyMore}
                </Button>
              </Link>
            )}
          </div>

          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="text-3xl font-bold text-accent mb-2">
              {chapters.length}
            </div>
            <div className="text-sm text-foreground/70">{t.dashboard.stats.totalChapters}</div>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="text-3xl font-bold text-accent mb-2">
              {chapters.filter(c => c.status === "completed").length}
            </div>
            <div className="text-sm text-foreground/70">{t.dashboard.stats.completed}</div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 mb-12"
        >
          <Link href="/create">
            <Button>{t.dashboard.actions.createNew}</Button>
          </Link>
          {user?.credits === 0 && (
            <Link href="/pricing">
              <Button variant="secondary">{t.dashboard.actions.getCredits}</Button>
            </Link>
          )}
        </motion.div>

        {/* Chapters List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">{t.dashboard.chapters.title}</h2>

          {chapters.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-bold mb-2">{t.dashboard.chapters.noChapters}</h3>
              <p className="text-foreground/70 mb-6">{t.dashboard.chapters.noChaptersDesc}</p>
              <Link href="/create">
                <Button>{t.dashboard.chapters.createFirst}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter, i) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    if (chapter.status === "completed") {
                      router.push(`/chapter/${chapter.id}`);
                    }
                  }}
                  className={`p-6 bg-card border border-border rounded-xl hover:border-accent/50 transition-all ${
                    chapter.status === "completed" ? "cursor-pointer" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{chapter.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-foreground/60 mb-3">
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
                      <p className="text-foreground/70 line-clamp-2">
                        {chapter.futureVision}
                      </p>
                    </div>
                    <div>
                      {chapter.status === "completed" && (
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                          ✓ {t.dashboard.chapters.ready}
                        </span>
                      )}
                      {chapter.status === "generating" && (
                        <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm animate-pulse">
                          {t.dashboard.chapters.generating}
                        </span>
                      )}
                      {chapter.status === "failed" && (
                        <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm">
                          {t.dashboard.chapters.failed}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
