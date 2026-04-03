import { getAllTools, getTagsForTools } from "@/db/queries";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/admin-delete-button";
import { deleteToolAction } from "@/lib/actions/tools";


export default async function AdminToolsPage() {
  const tools = await getAllTools();
  const tagMap = await getTagsForTools(tools.map((t) => t.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">工具管理</h1>
        <Link href="/admin/tools/new" className={buttonVariants()}>添加工具</Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>图标</TableHead>
            <TableHead>名称</TableHead>
            <TableHead>分类</TableHead>
            <TableHead>标签</TableHead>
            <TableHead>排序</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tools.map((tool) => (
            <TableRow key={tool.id}>
              <TableCell className="text-2xl">
                {tool.icon?.startsWith("http") ? (
                  <img src={tool.icon} alt={tool.name} className="w-6 h-6 object-contain" />
                ) : (
                  tool.icon
                )}
              </TableCell>
              <TableCell className="font-medium">{tool.name}</TableCell>
              <TableCell>{tool.category_name_zh}</TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {(tagMap.get(tool.id) || []).map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      style={tag.color ? { backgroundColor: tag.color, color: "#fff" } : undefined}
                    >
                      {tag.name_zh}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{tool.sort_order}</TableCell>
              <TableCell>
                <Badge variant={tool.is_published ? "default" : "outline"}>
                  {tool.is_published ? "已发布" : "草稿"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/admin/tools/${tool.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>编辑</Link>
                  <DeleteButton id={tool.id} action={deleteToolAction} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {tools.length === 0 && (
        <p className="text-center text-muted-foreground py-12">暂无工具，点击"添加工具"开始</p>
      )}
    </div>
  );
}
