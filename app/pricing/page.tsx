"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { toast } from "@/components/Toaster";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PricingPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [currency, setCurrency] = useState<"KZT" | "USD" | "EUR">("KZT");
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const rateMap = {
    KZT: 1,
    USD: 1 / 470,
    EUR: 1 / 510,
  };

  const roundingMap = {
    KZT: 10,
    USD: 1,
    EUR: 1,
  };

  const currencySymbol = {
    KZT: "₸",
    USD: "$",
    EUR: "€",
  };

  const formatPrice = (kzt: number) => {
    const converted = kzt * rateMap[currency];
    const step = roundingMap[currency];
    const rounded = Math.ceil(converted / step) * step;
    return `${currencySymbol[currency]}${rounded.toLocaleString()}`;
  };

  const plans = useMemo(
    () => [
      {
        id: "1_chapter",
        name: t.pricing.plans.single,
        price: formatPrice(1000),
        credits: 7,
        description: t.pricing.plans.singleDesc,
        features: [
          `7 ${t.pricing.features.chapters}`,
          t.pricing.features.length,
          t.pricing.features.customize,
        ],
      },
      {
        id: "5_chapters",
        name: t.pricing.plans.starter,
        price: formatPrice(2000),
        credits: 20,
        description: t.pricing.plans.starterDesc,
        features: [
          `20 ${t.pricing.features.chapters}`,
          t.pricing.features.consistent,
          t.pricing.features.multiple,
        ],
        popular: true,
      },
      {
        id: "10_chapters",
        name: t.pricing.plans.bundle,
        price: formatPrice(5000),
        credits: 40,
        description: t.pricing.plans.bundleDesc,
        features: [
          `40 ${t.pricing.features.chapters}`,
          t.pricing.features.journey,
          t.pricing.features.consistent,
        ],
      },
    ],
    [currency, t]
  );

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) setUser(data.user);
        })
        .catch(() => {});
    }
  }, []);

  const handlePurchase = async (productType: string) => {
    if (!user) {
      toast.error(t.pricing.signInToPurchase);
      router.push("/create");
      return;
    }

    setLoading(productType);

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productType }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || t.common.error);
      }
    } catch (error) {
      toast.error(t.common.error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">{t.pricing.title}</h1>
          <p className="text-xl text-foreground/70">{t.pricing.subtitle}</p>
          <div className="mt-6 flex justify-center gap-2">
            {(["KZT", "USD", "EUR"] as const).map((code) => (
              <Button
                key={code}
                size="sm"
                variant={currency === code ? "primary" : "secondary"}
                onClick={() => setCurrency(code)}
              >
                {code}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-2xl border ${
                plan.popular
                  ? "bg-accent/5 border-accent shadow-xl shadow-accent/20"
                  : "bg-card border-border"
              } relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent rounded-full text-sm font-medium">
                  {t.pricing.plans.mostPopular}
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-accent mb-2">{plan.price}</div>
              <p className="text-sm text-foreground/60 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-accent mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePurchase(plan.id)}
                loading={loading === plan.id}
                variant={plan.popular ? "primary" : "secondary"}
                className="w-full"
              >
                {user ? t.pricing.purchase : t.pricing.signInToPurchase}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center text-sm text-foreground/60"
        >
          <p>{t.pricing.securePayment}</p>
          <p className="mt-2">{t.pricing.creditsNeverExpire}</p>
          <p className="mt-2">{t.pricing.roundingNotice}</p>
        </motion.div>
      </div>
    </div>
  );
}
