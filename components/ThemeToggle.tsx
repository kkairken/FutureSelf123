"use client";

import { useTheme } from "@/lib/theme/ThemeContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = resolvedTheme === "dark";
  const nextTheme = theme === "system" ? "light" : theme === "light" ? "dark" : "system";

  const label =
    theme === "system"
      ? t.nav.themeSystem
      : isDark
        ? t.nav.themeDark
        : t.nav.themeLight;

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      title={label}
      aria-label={label}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-card transition-colors text-sm font-medium"
    >
      {theme === "system" ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="4" width="18" height="12" rx="2" strokeWidth={2} />
          <path d="M8 20h8" strokeWidth={2} strokeLinecap="round" />
          <path d="M12 16v4" strokeWidth={2} strokeLinecap="round" />
        </svg>
      ) : isDark ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="4" strokeWidth={2} />
          <path d="M12 2v2" strokeWidth={2} strokeLinecap="round" />
          <path d="M12 20v2" strokeWidth={2} strokeLinecap="round" />
          <path d="M2 12h2" strokeWidth={2} strokeLinecap="round" />
          <path d="M20 12h2" strokeWidth={2} strokeLinecap="round" />
          <path d="M4.93 4.93l1.41 1.41" strokeWidth={2} strokeLinecap="round" />
          <path d="M17.66 17.66l1.41 1.41" strokeWidth={2} strokeLinecap="round" />
          <path d="M4.93 19.07l1.41-1.41" strokeWidth={2} strokeLinecap="round" />
          <path d="M17.66 6.34l1.41-1.41" strokeWidth={2} strokeLinecap="round" />
        </svg>
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}
