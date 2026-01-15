"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{t.terms.title}</h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">{t.terms.sections.serviceDescription.title}</h2>
            <p className="text-foreground/80 leading-relaxed">{t.terms.sections.serviceDescription.body}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t.terms.sections.responsibilities.title}</h2>
            <p className="text-foreground/80 leading-relaxed">{t.terms.sections.responsibilities.body}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t.terms.sections.credits.title}</h2>
            <p className="text-foreground/80 leading-relaxed">{t.terms.sections.credits.body}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t.terms.sections.ownership.title}</h2>
            <p className="text-foreground/80 leading-relaxed">{t.terms.sections.ownership.body}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t.terms.sections.disclaimer.title}</h2>
            <p className="text-foreground/80 leading-relaxed">{t.terms.sections.disclaimer.body}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t.terms.sections.contact.title}</h2>
            <p className="text-foreground/80 leading-relaxed">{t.terms.sections.contact.body}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
