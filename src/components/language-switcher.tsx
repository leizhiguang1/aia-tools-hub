"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: string) {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    router.push(newPath);
  }

  return (
    <select
      value={currentLocale}
      onChange={(e) => switchLocale(e.target.value)}
      className="text-sm bg-transparent border rounded-md px-2 py-1 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {localeNames[locale as Locale]}
        </option>
      ))}
    </select>
  );
}
