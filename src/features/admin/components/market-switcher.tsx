"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales, localeConfig, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function MarketSwitcher({ currentMarket }: { currentMarket: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const cfg = localeConfig[currentMarket];

  // Swap only the /admin/{market} segment so the switcher keeps the user on
  // the same admin section (e.g. /tools) in the new market.
  const subPath = pathname.replace(/^\/admin\/[^/]+/, "") || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "gap-2 text-muted-foreground hover:text-foreground"
        )}
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest">
          Market
        </span>
        <span className="text-base leading-none">{cfg.flag}</span>
        <span className="text-sm font-medium">{cfg.marketLabel}</span>
        <ChevronDownIcon className="size-3.5 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Switch market</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {locales.map((locale) => {
            const lc = localeConfig[locale];
            const isActive = locale === currentMarket;
            return (
              <DropdownMenuItem
                key={locale}
                onClick={() => router.push(`/admin/${locale}${subPath}`)}
                className={cn("gap-2", isActive && "bg-accent/60")}
              >
                <span className="text-base leading-none">{lc.flag}</span>
                <span className="flex-1">{lc.marketLabel}</span>
                {isActive && (
                  <span className="text-[10px] font-mono text-muted-foreground">
                    current
                  </span>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
