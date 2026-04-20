import { localeConfig, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface MarketBannerProps {
  market: Locale;
  /** "market" banners display the current market's identity (used on
   *  market-scoped pages like news/events/leads). "global" banners warn the
   *  admin that the page edits data shared across every market. */
  variant?: "market" | "global";
}

export function MarketBanner({ market, variant = "market" }: MarketBannerProps) {
  if (variant === "global") {
    return (
      <div className="flex items-center gap-3 border-l-4 border-muted-foreground/40 bg-muted px-4 py-2.5 rounded-r-md mb-6">
        <span className="text-2xl leading-none">⚙️</span>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Global library
          </span>
          <span className="text-sm font-bold text-foreground">
            此页面的更改会应用到所有市场
          </span>
        </div>
        <span className="ml-auto text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-foreground text-background">
          GLOBAL
        </span>
      </div>
    );
  }

  const cfg = localeConfig[market];
  const { accent } = cfg;

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-l-4 px-4 py-2.5 rounded-r-md mb-6",
        accent.bg,
        accent.border
      )}
    >
      <span className="text-2xl leading-none">{cfg.flag}</span>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Editing market
        </span>
        <span className={cn("text-sm font-bold", accent.text)}>
          {cfg.marketLabel}
        </span>
      </div>
      <span
        className={cn(
          "ml-auto text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded",
          accent.activeBg,
          accent.activeText
        )}
      >
        /{market}
      </span>
    </div>
  );
}
