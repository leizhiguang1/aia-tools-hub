import { getAllPosts } from "@/db/queries";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/admin-delete-button";
import { deletePostAction } from "@/lib/actions/posts";


export default async function AdminNewsPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link href="/admin/news/new" className={buttonVariants()}>添加文章</Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>标题</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>作者</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title_zh}</TableCell>
              <TableCell className="font-mono text-sm">{post.slug}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>
                <Badge variant={post.is_published ? "default" : "outline"}>
                  {post.is_published ? "已发布" : "草稿"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/admin/news/${post.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>编辑</Link>
                  <DeleteButton id={post.id} action={deletePostAction} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
