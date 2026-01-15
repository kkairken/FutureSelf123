"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HowItWorksPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">{t.howItWorks.title}</h1>
          <p className="text-xl text-foreground/70">{t.howItWorks.subtitle}</p>
        </motion.div>

        {/* The Science */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 p-8 bg-card border border-border rounded-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">{t.howItWorks.science.title}</h2>
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            <p>{t.howItWorks.science.p1}</p>
            <p>{t.howItWorks.science.p2}</p>
            <p>{t.howItWorks.science.p3}</p>
          </div>
        </motion.section>

        {/* The Process */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">{t.howItWorks.process.title}</h2>
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: t.howItWorks.process.steps.tell.title,
                description: t.howItWorks.process.steps.tell.description,
              },
              {
                step: "02",
                title: t.howItWorks.process.steps.choose.title,
                description: t.howItWorks.process.steps.choose.description,
              },
              {
                step: "03",
                title: t.howItWorks.process.steps.tone.title,
                description: t.howItWorks.process.steps.tone.description,
              },
              {
                step: "04",
                title: t.howItWorks.process.steps.generate.title,
                description: t.howItWorks.process.steps.generate.description,
              },
              {
                step: "05",
                title: t.howItWorks.process.steps.receive.title,
                description: t.howItWorks.process.steps.receive.description,
              },
              {
                step: "06",
                title: t.howItWorks.process.steps.transform.title,
                description: t.howItWorks.process.steps.transform.description,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 p-6 bg-card border border-border rounded-xl hover:border-accent/50 transition-all"
              >
                <div className="flex-shrink-0">
                  <div className="text-4xl font-bold text-accent/30">{item.step}</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* What Makes It Different */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">{t.howItWorks.different.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: t.howItWorks.different.points.notBook.title,
                description: t.howItWorks.different.points.notBook.description,
              },
              {
                title: t.howItWorks.different.points.notAffirmations.title,
                description: t.howItWorks.different.points.notAffirmations.description,
              },
              {
                title: t.howItWorks.different.points.notGeneric.title,
                description: t.howItWorks.different.points.notGeneric.description,
              },
              {
                title: t.howItWorks.different.points.notMystical.title,
                description: t.howItWorks.different.points.notMystical.description,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-card border border-border rounded-xl"
              >
                <h3 className="text-lg font-bold mb-2 text-accent">{item.title}</h3>
                <p className="text-foreground/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-12 bg-gradient-to-br from-accent/10 to-accent-dark/10 border border-accent/20 rounded-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">{t.howItWorks.cta.title}</h2>
          <p className="text-foreground/70 mb-8">{t.howItWorks.cta.subtitle}</p>
          <Link href="/create">
            <Button size="lg">{t.howItWorks.cta.button}</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
