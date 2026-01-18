import fs from "fs";
import path from "path";

const DOCS: Record<string, string> = {
  offer: "docs/Публичный офер.txt",
  privacy: "docs/ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ.txt",
  terms: "docs/ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ.txt",
  payment: "docs/ОПИСАНИЕ ПОРЯДКА ОПЛАТЫ.txt",
  delivery: "docs/ИНФОРМАЦИЯ о способах получения цифрового товара.txt",
  contacts: "docs/КОНТАКТНЫЕ ДАННЫЕ КОМПАНИИ.txt",
};

export type DocKey = keyof typeof DOCS;

export function getDocContent(key: DocKey) {
  const filePath = path.join(process.cwd(), DOCS[key]);
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
