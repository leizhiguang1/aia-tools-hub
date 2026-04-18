export const locales = ["cn", "my", "tw"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "cn";

export function isValidLocale(lang: string): lang is Locale {
  return (locales as readonly string[]).includes(lang);
}

export function localePath(lang: string, path: string) {
  return `/${lang}${path === "/" ? "" : path}`;
}

export const localeConfig: Record<
  Locale,
  { name: string; dateLocale: string; htmlLang: string }
> = {
  cn: { name: "中文", dateLocale: "zh-CN", htmlLang: "zh-CN" },
  my: { name: "Bahasa Melayu", dateLocale: "ms-MY", htmlLang: "ms" },
  tw: { name: "中文 (台灣)", dateLocale: "zh-TW", htmlLang: "zh-TW" },
};

// Convenience accessors derived from localeConfig
export const localeNames: Record<Locale, string> = Object.fromEntries(
  locales.map((l) => [l, localeConfig[l].name])
) as Record<Locale, string>;

export const dateLocaleMap: Record<Locale, string> = Object.fromEntries(
  locales.map((l) => [l, localeConfig[l].dateLocale])
) as Record<Locale, string>;
