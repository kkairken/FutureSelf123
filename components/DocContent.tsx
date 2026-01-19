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

    fetch(`/api/docs/${docKey}?locale=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setDoc({
          title: data.title || "",
          body: data.body || "",
          loading: false,
        });
      })
      .catch(() => {
        if (!active) return;
        setDoc((prev) => ({ ...prev, loading: false }));
      });

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
