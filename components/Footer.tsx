"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="text-lg font-semibold mb-4">{t.footer.legal}</div>
            <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
              <Link href="/offer" className="hover:text-accent transition-colors">
                {t.footer.offer}
              </Link>
              <Link href="/privacy" className="hover:text-accent transition-colors">
                {t.footer.privacy}
              </Link>
              <Link href="/terms" className="hover:text-accent transition-colors">
                {t.footer.terms}
              </Link>
              <Link href="/payment-info" className="hover:text-accent transition-colors">
                {t.footer.payment}
              </Link>
              <Link href="/delivery-info" className="hover:text-accent transition-colors">
                {t.footer.delivery}
              </Link>
              <Link href="/contacts" className="hover:text-accent transition-colors">
                {t.footer.contacts}
              </Link>
            </div>
          </div>

          <div className="md:text-right">
            <div className="text-lg font-semibold mb-4">{t.footer.payments}</div>
            <div className="flex items-center gap-3 md:justify-end">
              <img src="/payments/visa.svg" alt="Visa" className="h-6 w-auto" />
              <img src="/payments/mastercard.svg" alt="Mastercard" className="h-6 w-auto" />
            </div>
            <div className="text-xs text-foreground/60 mt-3">
              {t.footer.freedomPay}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
