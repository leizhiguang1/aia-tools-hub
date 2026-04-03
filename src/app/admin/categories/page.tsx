import { getCategories } from "@/db/queries";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/lib/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/admin-delete-button";


export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">分类管理</h1>

      {/* Add new */}
      <form action={createCategoryAction} className="flex gap-2 mb-6 items-end">
        <div>
          <label className="text-sm font-medium">中文名称</label>
          <Input name="name_zh" required placeholder="日常基建与模型" />
        </div>
        <div>
          <label className="text-sm font-medium">English Name</label>
          <Input name="name_en" placeholder="Daily Models" />
        </div>
        <div>
          <label className="text-sm font-medium">Slug</label>
          <Input name="slug" required placeholder="models" />
        </div>
        <div>
          <label className="text-sm font-medium">排序</label>
          <Input name="sort_order" type="number" defaultValue="0" className="w-20" />
        </div>
        <Button type="submit">添加</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>中文名称</TableHead>
            <TableHead>English Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>排序</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>{cat.name_zh}</TableCell>
              <TableCell>{cat.name_en}</TableCell>
              <TableCell className="font-mono text-sm">{cat.slug}</TableCell>
              <TableCell>{cat.sort_order}</TableCell>
              <TableCell>
                <DeleteButton id={cat.id} action={deleteCategoryAction} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
