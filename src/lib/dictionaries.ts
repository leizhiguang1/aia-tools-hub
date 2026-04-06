import "server-only";
import type { Locale } from "./i18n";

const dictionaries = {
  zh: () => import("@/messages/zh.json").then((m) => m.default),
  en: () => import("@/messages/en.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
