import { getTags } from "@/db/queries";
import { createTagAction, deleteTagAction } from "@/lib/actions/tags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/admin-delete-button";

export default async function AdminTagsPage() {
  const tags = await getTags();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">标签管理</h1>

      {/* Add new */}
      <form action={createTagAction} className="flex gap-2 mb-6 items-end flex-wrap">
        <div>
          <label className="text-sm font-medium">中文名称</label>
          <Input name="name_zh" required placeholder="主要用" />
        </div>
        <div>
          <label className="text-sm font-medium">English Name</label>
          <Input name="name_en" placeholder="Primary" />
        </div>
        <div>
          <label className="text-sm font-medium">Slug</label>
          <Input name="slug" required placeholder="primary" />
        </div>
        <div>
          <label className="text-sm font-medium">颜色</label>
          <Input name="color" type="color" defaultValue="#6366f1" className="w-16 h-9 p-1" />
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
            <TableHead>预览</TableHead>
            <TableHead>中文名称</TableHead>
            <TableHead>English Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>颜色</TableHead>
            <TableHead>排序</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>
                <Badge
                  style={tag.color ? { backgroundColor: tag.color, color: "#fff" } : undefined}
                >
                  {tag.name_zh}
                </Badge>
              </TableCell>
              <TableCell>{tag.name_zh}</TableCell>
              <TableCell>{tag.name_en}</TableCell>
              <TableCell className="font-mono text-sm">{tag.slug}</TableCell>
              <TableCell>
                {tag.color && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: tag.color }} />
                    <span className="text-xs font-mono">{tag.color}</span>
                  </div>
                )}
              </TableCell>
              <TableCell>{tag.sort_order}</TableCell>
              <TableCell>
                <DeleteButton id={tag.id} action={deleteTagAction} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {tags.length === 0 && (
        <p className="text-center text-muted-foreground py-8">暂无标签，请添加</p>
      )}
    </div>
  );
}
