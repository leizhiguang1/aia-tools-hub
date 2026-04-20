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
  {
    name: string;
    dateLocale: string;
    htmlLang: string;
    /** Short market label shown in the admin banner. */
    marketLabel: string;
    /** Flag emoji shown in the admin sidebar/banner for at-a-glance recognition. */
    flag: string;
    /** Tailwind color tokens for the admin market banner/accents. Each market
     *  gets a distinct hue so the currently-selected market is unmistakable. */
    accent: {
      bg: string;
      border: string;
      text: string;
      ring: string;
      activeBg: string;
      activeText: string;
    };
  }
> = {
  cn: {
    name: "中文",
    dateLocale: "zh-CN",
    htmlLang: "zh-CN",
    marketLabel: "China · 中国",
    flag: "🇨🇳",
    accent: {
      bg: "bg-red-50",
      border: "border-red-500",
      text: "text-red-700",
      ring: "ring-red-500",
      activeBg: "bg-red-500",
      activeText: "text-white",
    },
  },
  my: {
    name: "Bahasa Melayu",
    dateLocale: "ms-MY",
    htmlLang: "ms",
    marketLabel: "Malaysia",
    flag: "🇲🇾",
    accent: {
      bg: "bg-blue-50",
      border: "border-blue-500",
      text: "text-blue-700",
      ring: "ring-blue-500",
      activeBg: "bg-blue-500",
      activeText: "text-white",
    },
  },
  tw: {
    name: "中文 (台灣)",
    dateLocale: "zh-TW",
    htmlLang: "zh-TW",
    marketLabel: "Taiwan · 台灣",
    flag: "🇹🇼",
    accent: {
      bg: "bg-amber-50",
      border: "border-amber-500",
      text: "text-amber-800",
      ring: "ring-amber-500",
      activeBg: "bg-amber-500",
      activeText: "text-white",
    },
  },
};

// Convenience accessors derived from localeConfig
export const localeNames: Record<Locale, string> = Object.fromEntries(
  locales.map((l) => [l, localeConfig[l].name])
) as Record<Locale, string>;

export const dateLocaleMap: Record<Locale, string> = Object.fromEntries(
  locales.map((l) => [l, localeConfig[l].dateLocale])
) as Record<Locale, string>;
