export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

export function isValidLocale(lang: string): lang is Locale {
  return (locales as readonly string[]).includes(lang);
}

export function localePath(lang: string, path: string) {
  return `/${lang}${path === "/" ? "" : path}`;
}

export const localeNames: Record<Locale, string> = {
  zh: "中文",
  en: "English",
};

export const dateLocaleMap: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en-US",
};
