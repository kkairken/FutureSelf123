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

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <nav className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold">
          <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
            Future Self
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/how-it-works"
            className={`text-sm hover:text-accent transition-colors ${
              pathname === "/how-it-works" ? "text-accent" : ""
            }`}
          >
            {t.nav.howItWorks}
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm hover:text-accent transition-colors ${
                  pathname === "/dashboard" ? "text-accent" : ""
                }`}
              >
                {t.nav.dashboard}
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground/60">
                  {user.credits} {t.nav.credits}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm hover:text-accent transition-colors"
                >
                  {t.nav.logout}
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/create"
              className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors"
            >
              {t.nav.getStarted}
            </Link>
          )}

          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </nav>
    </motion.header>
  );
}
