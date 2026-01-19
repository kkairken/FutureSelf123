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
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const totalChapters = books.reduce((count, book) => count + (book._count?.chapters || 0), 0);
  const completedStories = books.filter((book) => book.chapters?.[0]?.status === "completed").length;

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

        // Fetch books
        const chaptersRes = await fetch("/api/chapters/list", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const chaptersData = await chaptersRes.json();

        if (chaptersRes.ok) {
          setBooks(chaptersData.books || []);
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
            <Link href="/pricing">
              <Button size="sm" className="mt-4 w-full">
                {t.dashboard.stats.buyMore}
              </Button>
            </Link>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="text-3xl font-bold text-accent mb-2">
              {totalChapters}
            </div>
            <div className="text-sm text-foreground/70">{t.dashboard.stats.totalChapters}</div>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="text-3xl font-bold text-accent mb-2">
              {completedStories}
            </div>
            <div className="text-sm text-foreground/70">{t.dashboard.stats.completed}</div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <Link href="/create" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">{t.dashboard.books.startNew}</Button>
          </Link>
          {user?.credits === 0 && (
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto">
                {t.dashboard.actions.getCredits}
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Stories List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">{t.dashboard.books.title}</h2>

          {books.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-bold mb-2">{t.dashboard.books.noBooks}</h3>
              <p className="text-foreground/70 mb-6">{t.dashboard.books.noBooksDesc}</p>
              <Link href="/create">
                <Button>{t.dashboard.books.createFirst}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {books.map((book, i) => {
                const latest = book.chapters?.[0];
                return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    router.push(`/book/${book.id}`);
                  }}
                  className="p-6 bg-card border border-border rounded-xl hover:border-accent/50 transition-all cursor-pointer"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-foreground/60 mb-3">
                        <span>{t.dashboard.books.chaptersCount}: {book._count?.chapters || 0}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          {t.dashboard.books.lastUpdated}: {new Date(book.updatedAt).toLocaleDateString(locale)}
                        </span>
                      </div>
                      <p className="text-foreground/70 line-clamp-2">{book.futureVision}</p>
                    </div>
                    <div className="self-start sm:self-auto">
                      {latest?.status === "generating" && (
                        <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm animate-pulse">
                          {t.dashboard.chapters.generating}
                        </span>
                      )}
                      {latest?.status === "failed" && (
                        <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm">
                          {t.dashboard.chapters.failed}
                        </span>
                      )}
                      {latest?.status === "completed" && (
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                          ✓ {t.dashboard.chapters.ready}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )})}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
