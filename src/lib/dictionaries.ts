import "server-only";
import type { Locale } from "./i18n";

const dictionaries = {
  cn: () => import("@/messages/cn.json").then((m) => m.default),
  my: () => import("@/messages/my.json").then((m) => m.default),
  tw: () => import("@/messages/tw.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
