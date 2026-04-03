import { getTools, getCategories, getTagsForTools } from "@/db/queries";
import { ToolsGrid } from "@/components/tools-grid";

export default async function HomePage() {
  const [tools, categories] = await Promise.all([
    getTools(),
    getCategories(),
  ]);

  const tagMap = await getTagsForTools(tools.map((t) => t.id));
  const toolsWithTags = tools.map((tool) => ({
    ...tool,
    tag_list: tagMap.get(tool.id) || [],
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">AI 工具集</h1>
      <ToolsGrid tools={toolsWithTags} categories={categories} />
    </div>
  );
}
