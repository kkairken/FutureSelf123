import fs from "fs";
import path from "path";
import type { Locale } from "@/lib/i18n/dictionaries";

const DOCS: Record<string, Record<string, string>> = {
  offer: {
    ru: "docs/Публичный офер.txt",
    en: "docs/offer.en.txt",
    kz: "docs/offer.kz.txt",
  },
  privacy: {
    ru: "docs/ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ.txt",
    en: "docs/privacy.en.txt",
    kz: "docs/privacy.kz.txt",
  },
  terms: {
    ru: "docs/ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ.txt",
    en: "docs/terms.en.txt",
    kz: "docs/terms.kz.txt",
  },
  payment: {
    ru: "docs/ОПИСАНИЕ ПОРЯДКА ОПЛАТЫ.txt",
    en: "docs/payment.en.txt",
    kz: "docs/payment.kz.txt",
  },
  delivery: {
    ru: "docs/ИНФОРМАЦИЯ о способах получения цифрового товара.txt",
    en: "docs/delivery.en.txt",
    kz: "docs/delivery.kz.txt",
  },
  contacts: {
    ru: "docs/КОНТАКТНЫЕ ДАННЫЕ КОМПАНИИ.txt",
    en: "docs/contacts.en.txt",
    kz: "docs/contacts.kz.txt",
  },
};

export type DocKey = keyof typeof DOCS;

export function getDocContent(key: DocKey, locale: Locale | string = "ru") {
  const fallback = DOCS[key].ru;
  const localized = DOCS[key][locale as string] || fallback;
  const filePath = path.join(process.cwd(), localized);
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/);
  const titleIndex = lines.findIndex((line) => line.trim().length > 0);
  const title = titleIndex >= 0 ? lines[titleIndex].trim() : "";
  const bodyLines = titleIndex >= 0 ? lines.slice(titleIndex + 1) : lines;

  return {
    title,
    body: bodyLines.join("\n").trim(),
  };
}
