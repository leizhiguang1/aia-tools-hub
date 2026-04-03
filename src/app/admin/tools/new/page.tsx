import { getCategories, getTags } from "@/db/queries";
import { createToolAction } from "@/lib/actions/tools";
import { ToolForm } from "@/components/tool-form";


export default async function NewToolPage() {
  const [categories, allTags] = await Promise.all([getCategories(), getTags()]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">添加工具</h1>
      <ToolForm categories={categories} allTags={allTags} action={createToolAction} />
    </div>
  );
}
