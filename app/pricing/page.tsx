"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { toast } from "@/components/Toaster";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PricingPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [currency, setCurrency] = useState<"KZT" | "USD" | "EUR">("KZT");
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const rateMap = {
    KZT: 1,
    USD: 1 / (Number(process.env.NEXT_PUBLIC_RATE_USD) || 470),
    EUR: 1 / (Number(process.env.NEXT_PUBLIC_RATE_EUR) || 510),
  };

  const roundingMap = {
    KZT: Number(process.env.NEXT_PUBLIC_ROUND_KZT) || 10,
    USD: Number(process.env.NEXT_PUBLIC_ROUND_USD) || 1,
    EUR: Number(process.env.NEXT_PUBLIC_ROUND_EUR) || 1,
  };

  const basePriceMap = {
    "1_chapter": Number(process.env.NEXT_PUBLIC_PRICE_7_KZT) || 1000,
    "5_chapters": Number(process.env.NEXT_PUBLIC_PRICE_20_KZT) || 2000,
    "10_chapters": Number(process.env.NEXT_PUBLIC_PRICE_40_KZT) || 5000,
    "subscription_100": Number(process.env.NEXT_PUBLIC_PRICE_100_KZT) || 6000,
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
        amountKzt: basePriceMap["1_chapter"],
        price: formatPrice(basePriceMap["1_chapter"]),
        credits: 7,
        period: "",
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
        amountKzt: basePriceMap["5_chapters"],
        price: formatPrice(basePriceMap["5_chapters"]),
        credits: 20,
        period: "",
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
        amountKzt: basePriceMap["10_chapters"],
        price: formatPrice(basePriceMap["10_chapters"]),
        credits: 40,
        period: "",
        description: t.pricing.plans.bundleDesc,
        features: [
          `40 ${t.pricing.features.chapters}`,
          t.pricing.features.journey,
          t.pricing.features.consistent,
        ],
      },
      {
        id: "subscription_100",
        name: t.pricing.plans.subscription,
        amountKzt: basePriceMap["subscription_100"],
        price: formatPrice(basePriceMap["subscription_100"]),
        credits: 100,
        period: t.home.pricing.perMonth,
        description: t.pricing.plans.subscriptionDesc,
        features: [
          `100 ${t.pricing.features.chapters} ${t.home.pricing.perMonth}`,
          t.pricing.features.cancel,
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
      const res = await fetch("/api/v1/payments/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_type: productType,
          language: locale,
        }),
      });

      const data = await res.json();

      if (res.ok && data.payment_url) {
        window.location.href = data.payment_url;
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-2xl border flex flex-col h-full ${
                plan.popular
                  ? "bg-accent/5 border-accent shadow-xl shadow-accent/20"
                  : "bg-card border-border"
              } relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-center rounded-full text-sm font-medium">
                  {t.pricing.plans.mostPopular}
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2 min-h-[3.5rem]">{plan.name}</h3>
              <div className="min-h-[4.5rem] mb-2">
                <div className="text-4xl font-bold text-accent">{plan.price}</div>
                {plan.period ? (
                  <div className="text-sm text-foreground/60">{plan.period}</div>
                ) : (
                  <div className="h-5" aria-hidden="true" />
                )}
              </div>
              <p className="text-sm text-foreground/60 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-accent mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Button
                  onClick={() => handlePurchase(plan.id)}
                  loading={loading === plan.id}
                  variant={plan.popular ? "primary" : "secondary"}
                  className="w-full"
                >
                  {user ? t.pricing.purchase : t.pricing.signInToPurchase}
                </Button>
              </div>
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
          <p className="mt-2">{t.pricing.ratesNotice}</p>
        </motion.div>
      </div>
    </div>
  );
}
