"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  const plans = [
    { name: t.pricing.plans.single, price: "₸1,000", credits: 7, perMonth: false },
    { name: t.pricing.plans.starter, price: "₸2,000", credits: 20, perMonth: false },
    { name: t.pricing.plans.bundle, price: "₸5,000", credits: 40, perMonth: false },
    { name: t.pricing.plans.subscription, price: "₸6,000", credits: 100, perMonth: true },
  ];

  const creditLabel = (count: number, perMonth?: boolean) => {
    const base = `${count} ${count === 1 ? t.home.pricing.chapter : t.home.pricing.chapters}`;
    return perMonth ? `${base}${t.home.pricing.perMonth}` : base;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium"
          >
            {t.home.badge}
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-accent-light to-accent bg-clip-text text-transparent">
            {t.home.hero.title}
          </h1>

          <p className="text-xl md:text-2xl text-foreground/70 mb-12 leading-relaxed">
            {t.home.hero.subtitle}
            <br />
            <span className="text-accent-light">{t.home.hero.notBook}</span>
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/create">
              <Button size="lg">{t.home.cta.create}</Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="secondary">
                {t.home.cta.howItWorks}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              title: t.home.features.future.title,
              description: t.home.features.future.description,
              icon: "✨",
            },
            {
              title: t.home.features.psychology.title,
              description: t.home.features.psychology.description,
              icon: "🧠",
            },
            {
              title: t.home.features.personalized.title,
              description: t.home.features.personalized.description,
              icon: "📖",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-card border border-border rounded-2xl hover:border-accent/50 transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works Preview */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-6">{t.home.process.title}</h2>
          <div className="space-y-6 text-left">
            {[
              { step: "1", text: t.home.process.steps.share },
              { step: "2", text: t.home.process.steps.choose },
              { step: "3", text: t.home.process.steps.receive },
              { step: "4", text: t.home.process.steps.read },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-6 bg-card border border-border rounded-xl"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <p className="text-lg pt-1">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing Preview */}
      <section className="container mx-auto px-4 py-20 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-4">{t.home.pricing.title}</h2>
          <p className="text-foreground/70 mb-12">{t.home.pricing.subtitle}</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-card border border-border rounded-xl hover:border-accent transition-all"
              >
                <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-accent mb-2">{plan.price}</div>
                <p className="text-sm text-foreground/60">
                  {creditLabel(plan.credits, plan.perMonth)}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12">
            <Link href="/create">
              <Button size="lg">{t.home.pricing.startNow}</Button>
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
