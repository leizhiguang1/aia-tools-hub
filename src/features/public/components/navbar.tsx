"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/dictionaries";
import { Menu, X } from "lucide-react";

export function Navbar({ lang, dict }: { lang: string; dict: Dictionary }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: `/${lang}`, label: dict.nav.tools },
    { href: `/${lang}/events`, label: dict.nav.events },
  ];

  function isActive(href: string) {
    const normalized = pathname.replace(/\/+$/, "") || `/${lang}`;
    return href === `/${lang}`
      ? normalized === `/${lang}`
      : normalized.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
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

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-1.5 text-sm transition-colors border-b-2",
                isActive(item.href)
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile: spacer + hamburger */}
        <div className="flex-1 md:hidden" />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-3 py-2.5 text-sm rounded-lg transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
