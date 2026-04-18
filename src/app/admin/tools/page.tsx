import { getAllTools, getTagsForTools, getCategories, getTags, getBulkAllLocaleTranslations } from "@/db/queries";
import { AdminTools } from "@/features/admin/components/tools";

export default async function AdminToolsPage() {
  const [tools, categories, allTags] = await Promise.all([
    getAllTools(),
    getCategories(),
    getTags(),
  ]);

  const toolIds = tools.map((t) => t.id);
  const [tagMap, translationsRecord] = await Promise.all([
    getTagsForTools(toolIds),
    getBulkAllLocaleTranslations("tool", toolIds),
  ]);

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
      translationsRecord={translationsRecord}
    />
  );
}
