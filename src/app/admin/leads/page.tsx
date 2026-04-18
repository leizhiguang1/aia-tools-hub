import { cookies } from "next/headers";
import { getAllLeads } from "@/db/queries";
import { AdminLeads } from "@/features/admin/components/leads";
import { defaultLocale, isValidLocale } from "@/lib/i18n";

export default async function AdminLeadsPage() {
  const cookieStore = await cookies();
  const marketCookie = cookieStore.get("admin_market")?.value;
  const currentMarket = marketCookie && isValidLocale(marketCookie) ? marketCookie : defaultLocale;

  const leads = await getAllLeads(currentMarket);
  return <AdminLeads leads={leads} />;
}
