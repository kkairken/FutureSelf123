"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{t.privacy.title}</h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">{t.privacy.sections.dataCollection.title}</h2>
            <p className="text-foreground/80 leading-relaxed">{t.privacy.sections.dataCollection.body}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t.privacy.sections.dataUsage.title}</h2>
            <p className="text-foreground/80 leading-relaxed">{t.privacy.sections.dataUsage.body}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t.privacy.sections.dataSecurity.title}</h2>
            <p className="text-foreground/80 leading-relaxed">{t.privacy.sections.dataSecurity.body}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t.privacy.sections.rights.title}</h2>
            <p className="text-foreground/80 leading-relaxed">{t.privacy.sections.rights.body}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t.privacy.sections.contact.title}</h2>
            <p className="text-foreground/80 leading-relaxed">{t.privacy.sections.contact.body}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
