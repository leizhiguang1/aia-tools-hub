import { getAllTools, getTagsForTools, getCategories, getTags } from "@/db/queries";
import { AdminTools } from "@/components/admin-tools";

export default async function AdminToolsPage() {
  const [tools, categories, allTags] = await Promise.all([
    getAllTools(),
    getCategories(),
    getTags(),
  ]);
  const tagMap = await getTagsForTools(tools.map((t) => t.id));

  // Convert Map to plain object for client serialization
  const tagRecord: Record<string, { id: string; name: string; slug: string; color: string; sort_order: number; created_at: number }[]> = {};
  for (const [key, value] of tagMap) {
    tagRecord[key] = value;
  }

  return (
    <AdminTools
      tools={tools}
      tagRecord={tagRecord}
      categories={categories}
      allTags={allTags}
    />
  );
}
