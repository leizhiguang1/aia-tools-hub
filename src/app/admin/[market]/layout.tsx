import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AdminSidebar } from "@/features/admin/components/sidebar";
import { MarketBanner } from "@/features/admin/components/market-banner";
import { isValidLocale, localeConfig } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const GLOBAL_SECTIONS = ["categories", "tags"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isValidLocale(market)) return {};
  const cfg = localeConfig[market];
  return {
    title: `[${market.toUpperCase()}] ${cfg.marketLabel} · AIA Admin`,
  };
}

export default async function AdminMarketLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isValidLocale(market)) notFound();

  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  // Second URL segment after /admin/{market} identifies the section.
  const section = pathname.split("/")[3] ?? "";
  const isGlobal = GLOBAL_SECTIONS.includes(section);

  const accent = localeConfig[market].accent;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentMarket={market} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Matches the sidebar's top stripe so the portal identity spans the whole chrome. */}
        <div className={cn("h-1.5 w-full", isGlobal ? "bg-foreground" : accent.activeBg)} />
        <main className="flex-1 p-6">
          <MarketBanner market={market} variant={isGlobal ? "global" : "market"} />
          {children}
        </main>
      </div>
    </div>
  );
}
