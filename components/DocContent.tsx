"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type DocKey = "offer" | "privacy" | "terms" | "payment" | "delivery" | "contacts";

interface DocState {
  title: string;
  body: string;
  loading: boolean;
}

export function DocContent({ docKey }: { docKey: DocKey }) {
  const { locale, t } = useLanguage();
  const [doc, setDoc] = useState<DocState>({
    title: "",
    body: "",
    loading: true,
  });

  useEffect(() => {
    let active = true;
    setDoc((prev) => ({ ...prev, loading: true }));

    const loadDoc = async () => {
      const tryLocale = async (lang: string) => {
        const res = await fetch(`/legal/${docKey}.${lang}.txt`, { cache: "no-store" });
        if (!res.ok) return null;
        return res.text();
      };

      try {
        const text = (await tryLocale(locale)) || (await tryLocale("ru"));
        if (!active) return;
        if (!text) {
          setDoc((prev) => ({ ...prev, loading: false }));
          return;
        }

        const lines = text.split(/\r?\n/);
        const titleIndex = lines.findIndex((line) => line.trim().length > 0);
        const title = titleIndex >= 0 ? lines[titleIndex].trim() : "";
        const bodyLines = titleIndex >= 0 ? lines.slice(titleIndex + 1) : lines;

        setDoc({
          title,
          body: bodyLines.join("\n").trim(),
          loading: false,
        });
      } catch {
        if (!active) return;
        setDoc((prev) => ({ ...prev, loading: false }));
      }
    };

    loadDoc();

    return () => {
      active = false;
    };
  }, [docKey, locale]);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {doc.loading ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4 animate-pulse">📄</div>
            <h2 className="text-xl font-semibold">{t.common.loading}</h2>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-8">{doc.title}</h1>
            <div className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
              {doc.body}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
