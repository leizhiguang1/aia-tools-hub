import { localeConfig, type Locale, isValidLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Small pill that tags an element (page header, dialog title, list item)
 *  with the market it belongs to. Used to keep the "which portal am I in"
 *  answer visible at every level of the admin UI. */
export function MarketChip({ market, className }: { market: string; className?: string }) {
  if (!isValidLocale(market)) return null;
  const cfg = localeConfig[market as Locale];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold",
        cfg.accent.activeBg,
        cfg.accent.activeText,
        className
      )}
    >
      <span className="text-sm leading-none">{cfg.flag}</span>
      <span>{cfg.marketLabel}</span>
    </span>
  );
}
