import { notFound } from "next/navigation";
import { getAllTools, getTagsForTools, getCategories, getTags } from "@/db/queries";
import { AdminTools } from "@/features/admin/components/tools";
import { isValidLocale } from "@/lib/i18n";

export default async function AdminToolsPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isValidLocale(market)) notFound();

  const [tools, categories, allTags] = await Promise.all([
    getAllTools(market),
    getCategories(),
    getTags(),
  ]);

  const toolIds = tools.map((t) => t.id);
  const tagMap = await getTagsForTools(toolIds);

  const tagRecord: Record<string, { id: string; name: string; slug: string; color: string; sort_order: number; created_at: string }[]> = {};
  for (const [key, value] of tagMap) {
    tagRecord[key] = value;
  }

  return (
    <AdminTools
      tools={tools}
      tagRecord={tagRecord}
      categories={categories}
      allTags={allTags}
      currentMarket={market}
    />
  );
}
