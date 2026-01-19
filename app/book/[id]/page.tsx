"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { Textarea } from "@/components/Textarea";
import { toast } from "@/components/Toaster";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export const runtime = "edge";

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [continuing, setContinuing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [continuationNote, setContinuationNote] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          router.push("/create");
          return;
        }

        const res = await fetch(`/api/books/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setBook(data.book);
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

    fetchBook();
  }, [params.id, router, t.common.error]);

  useEffect(() => {
    if (!continuing) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 6) + 2;
        return next > 95 ? 95 : next;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [continuing]);

  const handleContinue = async (note?: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const userRes = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      if (!userData.user || userData.user.credits < 1) {
        router.push("/pricing");
        return;
      }
    } catch {
      router.push("/pricing");
      return;
    }

    setContinuing(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/chapters/continue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: book.id, continuationNote: note || "" }),
      });
      const data = await res.json();
      if (res.ok && data.chapterId) {
        router.push(`/chapter/${data.chapterId}`);
        return;
      }

      const fallback = await fetch(`/api/books/${book.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fallbackData = await fallback.json();
      const chapters = fallbackData?.book?.chapters || [];
      const latest = chapters[chapters.length - 1];
      if (fallback.ok && latest?.id) {
        router.push(`/chapter/${latest.id}`);
        return;
      }

      toast.error(data.error || t.common.error);
    } catch (error) {
      toast.error(t.common.error);
    } finally {
      setContinuing(false);
    }
  };

  if (loading || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📖</div>
          <h2 className="text-2xl font-bold">{t.common.loading}</h2>
        </div>
      </div>
    );
  }

  if (continuing) {
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
          <p className="text-foreground/70 mb-2">{t.chapter.creatingDesc}</p>
          <p className="text-sm text-accent">{t.chapter.timeEstimate}</p>
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-foreground/60 mb-2">
              <span>{t.common.loading}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 sm:py-20">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
          <p className="text-foreground/70">{book.futureVision}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={() => setShowContinueModal(true)}
            loading={continuing}
            className="w-full sm:w-auto"
          >
            {t.dashboard.books.continue}
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/create")}
            className="w-full sm:w-auto"
          >
            {t.dashboard.books.startNew}
          </Button>
        </motion.div>

        <div className="space-y-3">
          {book.chapters.map((chapter: any) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-card border border-border rounded-xl hover:border-accent/50 transition-all cursor-pointer"
              onClick={() => {
                if (chapter.status === "completed") {
                  router.push(`/chapter/${chapter.id}`);
                }
              }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold">
                    {t.chapter.title.replace("{name}", `#${chapter.chapterNumber}`)}
                  </div>
                  <div className="text-sm text-foreground/60">
                    {new Date(chapter.createdAt).toLocaleDateString(locale)}
                  </div>
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
      </div>

      {showContinueModal && !continuing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowContinueModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold mb-2">{t.chapter.continuePromptTitle}</h3>
            <p className="text-sm text-foreground/70 mb-4">{t.chapter.continuePromptBody}</p>
            <Textarea
              placeholder={t.chapter.continuePromptPlaceholder}
              value={continuationNote}
              onChange={(e) => setContinuationNote(e.target.value)}
              rows={4}
            />
            <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setContinuationNote("");
                  setShowContinueModal(false);
                }}
              >
                {t.chapter.continuePromptCancel}
              </Button>
              <Button
                onClick={() => {
                  const note = continuationNote.trim();
                  setShowContinueModal(false);
                  setContinuationNote("");
                  handleContinue(note);
                }}
              >
                {t.chapter.continuePromptConfirm}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
