import { getAllTools, getTagsForTools, getCategories, getTags, getTranslations } from "@/db/queries";
import { AdminTools } from "@/components/admin-tools";
import { locales, defaultLocale } from "@/lib/i18n";

export default async function AdminToolsPage() {
  const [tools, categories, allTags] = await Promise.all([
    getAllTools(),
    getCategories(),
    getTags(),
  ]);
  const tagMap = await getTagsForTools(tools.map((t) => t.id));

  // Convert Map to plain object for client serialization
  const tagRecord: Record<string, { id: string; name: string; slug: string; color: string; sort_order: number; created_at: string }[]> = {};
  for (const [key, value] of tagMap) {
    tagRecord[key] = value;
  }

  // Fetch translations for all tools
  const translationsRecord: Record<string, Record<string, Record<string, string>>> = {};
  for (const tool of tools) {
    const trans = await getTranslations("tool", tool.id);
    const byLocale: Record<string, Record<string, string>> = {};
    for (const t of trans) {
      if (t.locale === defaultLocale) continue;
      if (!byLocale[t.locale]) byLocale[t.locale] = {};
      byLocale[t.locale][t.field] = t.value;
    }
    if (Object.keys(byLocale).length > 0) {
      translationsRecord[tool.id] = byLocale;
    }
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
