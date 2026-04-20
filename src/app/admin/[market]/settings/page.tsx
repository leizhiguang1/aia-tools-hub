import { notFound } from "next/navigation";
import { getMarketById } from "@/db/queries";
import { MarketSettingsForm } from "@/features/admin/components/market-settings-form";
import { isValidLocale, localeConfig } from "@/lib/i18n";

export default async function AdminMarketSettingsPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isValidLocale(market)) notFound();

  const marketRow = await getMarketById(market);
  if (!marketRow) notFound();

  const cfg = localeConfig[market];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">市场设置 / Market Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {cfg.flag} {cfg.marketLabel}
        </p>
      </div>
      <MarketSettingsForm market={marketRow} />
    </div>
  );
}
