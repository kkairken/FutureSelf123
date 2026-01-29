"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const { t, setLocale, locale } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Check for user session
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
            // Set user's preferred language
            const saved = localStorage.getItem("locale");
            if (!saved && data.user.language && data.user.language !== locale) {
              setLocale(data.user.language);
            }
          }
        })
        .catch(() => {});
    }
  }, [setLocale, locale]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    window.location.href = "/";
  };

  const navLinkClass =
    "text-sm hover:text-accent transition-colors";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <nav className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
              Future Self
            </span>
          </Link>

          {/* Theme & Language - always visible */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen((open) => !open)}
              className="p-2 rounded-lg border border-border hover:bg-card transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 6l12 12M18 6L6 18" strokeWidth={2} strokeLinecap="round" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 6h18M3 12h18M3 18h18" strokeWidth={2} strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/how-it-works"
              className={`${navLinkClass} ${pathname === "/how-it-works" ? "text-accent" : ""}`}
            >
              {t.nav.howItWorks}
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`${navLinkClass} ${pathname === "/dashboard" ? "text-accent" : ""}`}
                >
                  {t.nav.dashboard}
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-foreground/60">
                    {user.credits} {t.nav.credits}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={navLinkClass}
                  >
                    {t.nav.logout}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className={navLinkClass}
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}

            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden w-full space-y-4">
            <div className="grid gap-2">
              <Link
                href="/how-it-works"
                className={`px-3 py-2 rounded-lg border border-border ${pathname === "/how-it-works" ? "text-accent border-accent" : ""}`}
              >
                {t.nav.howItWorks}
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-lg border border-border ${pathname === "/dashboard" ? "text-accent border-accent" : ""}`}
                >
                  {t.nav.dashboard}
                </Link>
              )}
            </div>

            {user ? (
              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="text-sm text-foreground/60">
                  {user.credits} {t.nav.credits}
                </span>
                <button onClick={handleLogout} className={navLinkClass}>
                  {t.nav.logout}
                </button>
              </div>
            ) : (
              <div className="grid gap-2">
                <Link
                  href="/auth/login"
                  className="block text-center px-4 py-2 border border-border rounded-lg text-sm font-medium transition-colors hover:bg-card"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/auth/register"
                  className="block text-center px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </motion.header>
  );
}
