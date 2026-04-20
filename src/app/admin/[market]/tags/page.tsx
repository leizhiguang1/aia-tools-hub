import { notFound } from "next/navigation";
import { getTags } from "@/db/queries";
import { AdminTags } from "@/features/admin/components/tags";
import { isValidLocale } from "@/lib/i18n";

export default async function AdminTagsPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isValidLocale(market)) notFound();

  const tags = await getTags(market);

  return <AdminTags tags={tags} currentMarket={market} />;
}
