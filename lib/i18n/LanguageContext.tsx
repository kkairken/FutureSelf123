"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, defaultLocale, Dictionary, getDictionary } from "./dictionaries";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [t, setT] = useState<Dictionary>(getDictionary(defaultLocale));

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("locale") as Locale;
    if (saved && ["en", "ru", "kz"].includes(saved)) {
      setLocaleState(saved);
      setT(getDictionary(saved));
      document.documentElement.lang = saved;
      return;
    }
    document.documentElement.lang = defaultLocale;
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setT(getDictionary(newLocale));
    localStorage.setItem("locale", newLocale);
    document.documentElement.lang = newLocale;

    // Update user preference on server
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetch("/api/user/update-language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ language: newLocale }),
      }).catch(() => {});
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
