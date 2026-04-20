import { notFound } from "next/navigation";
import { getAllLeads } from "@/db/queries";
import { AdminLeads } from "@/features/admin/components/leads";
import { isValidLocale } from "@/lib/i18n";

export default async function AdminLeadsPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isValidLocale(market)) notFound();

  const leads = await getAllLeads(market);
  return <AdminLeads leads={leads} currentMarket={market} />;
}
