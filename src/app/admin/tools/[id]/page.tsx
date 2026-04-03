import { getToolById, getCategories, getTags, getTagsForTool } from "@/db/queries";
import { updateToolAction } from "@/lib/actions/tools";
import { ToolForm } from "@/components/tool-form";
import { notFound } from "next/navigation";


export default async function EditToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [tool, categories, allTags, toolTags] = await Promise.all([
    getToolById(id),
    getCategories(),
    getTags(),
    getTagsForTool(id),
  ]);

  if (!tool) notFound();

  const action = updateToolAction.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">编辑工具</h1>
      <ToolForm
        tool={tool}
        categories={categories}
        allTags={allTags}
        selectedTagIds={toolTags.map((t) => t.id)}
        action={action}
      />
    </div>
  );
}
