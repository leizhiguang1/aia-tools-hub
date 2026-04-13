import "server-only";
import type { Locale } from "./i18n";

const dictionaries = {
  "zh-MY": () => import("@/messages/zh-MY.json").then((m) => m.default),
  ms: () => import("@/messages/ms.json").then((m) => m.default),
  en: () => import("@/messages/en.json").then((m) => m.default),
  "zh-TW": () => import("@/messages/zh-TW.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
