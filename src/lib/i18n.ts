export const locales = ["zh-MY", "ms", "en", "zh-TW"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh-MY";

export function isValidLocale(lang: string): lang is Locale {
  return (locales as readonly string[]).includes(lang);
}

export function localePath(lang: string, path: string) {
  return `/${lang}${path === "/" ? "" : path}`;
}

export const localeNames: Record<Locale, string> = {
  "zh-MY": "中文 (马来西亚)",
  ms: "Bahasa Melayu",
  en: "English",
  "zh-TW": "中文 (台灣)",
};

export const dateLocaleMap: Record<Locale, string> = {
  "zh-MY": "zh-CN",
  ms: "ms-MY",
  en: "en-US",
  "zh-TW": "zh-TW",
};
