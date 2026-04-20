import { notFound } from "next/navigation";
import { getCategories } from "@/db/queries";
import { AdminCategories } from "@/features/admin/components/categories";
import { isValidLocale } from "@/lib/i18n";

export default async function AdminCategoriesPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isValidLocale(market)) notFound();

  const categories = await getCategories(market);

  return <AdminCategories categories={categories} currentMarket={market} />;
}
