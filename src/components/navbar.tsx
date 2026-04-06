"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Dictionary } from "@/lib/dictionaries";

export function Navbar({ lang, dict }: { lang: string; dict: Dictionary }) {
  const pathname = usePathname();

  const navItems = [
    { href: `/${lang}`, label: dict.nav.tools },
    { href: `/${lang}/events`, label: dict.nav.events },
    { href: `/${lang}/news`, label: dict.nav.news },
  ];


  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link
          href={`/${lang}`}
          className="font-bold text-lg flex items-center gap-2 shrink-0"
        >
          <Image
            src="/images/brand-logo.png"
            alt={dict.site_name}
            width={1024}
            height={214}
            className="h-9 w-auto"
            unoptimized
            priority
          />
        </Link>
        <nav className="flex-1 flex items-center justify-center gap-1">
          {navItems.map((item) => {
            const normalizedPathname = pathname.replace(/\/+$/, "") || `/${lang}`;
            const isActive =
              item.href === `/${lang}`
                ? normalizedPathname === `/${lang}`
                : normalizedPathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-1.5 text-sm transition-colors border-b-2",
                  isActive
                    ? "border-primary text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <LanguageSwitcher currentLocale={lang} />
      </div>
    </header>
  );
}
