"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { PostForm } from "@/features/admin/components/post-form";
import { MarketChip } from "@/features/admin/components/market-chip";
import { createPostAction, updatePostAction, deletePostAction } from "@/features/admin/actions/posts";
import type { Post, Tag } from "@/types";

interface AdminNewsProps {
  posts: Post[];
  tagRecord: Record<string, Tag[]>;
  allTags: Tag[];
  currentMarket: string;
}

export function AdminNews({ posts, tagRecord, allTags, currentMarket }: AdminNewsProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [editingTagIds, setEditingTagIds] = useState<string[]>([]);

  function openCreate() {
    setEditing(null);
    setEditingTagIds([]);
    setOpen(true);
  }

  function openEdit(post: Post) {
    setEditing(post);
    setEditingTagIds((tagRecord[post.id] || []).map((t) => t.id));
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditing(null);
  }

  const formAction = async (formData: FormData) => {
    if (editing) {
      await updatePostAction(editing.id, formData);
    } else {
      formData.set("market_id", currentMarket);
      await createPostAction(formData);
    }
    handleClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">文章管理</h1>
          <MarketChip market={currentMarket} />
        </div>
        <Button onClick={openCreate}>添加文章</Button>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{editing ? "编辑文章" : "添加文章"}</span>
              <MarketChip market={currentMarket} />
            </DialogTitle>
          </DialogHeader>
          <PostForm
            key={editing?.id ?? "new"}
            post={editing}
            allTags={allTags}
            selectedTagIds={editingTagIds}
            action={formAction}
            market={currentMarket}
          />
        </DialogContent>
      </Dialog>

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
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell className="font-mono text-sm">{post.slug}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>
                <Badge variant={post.is_published ? "default" : "outline"}>
                  {post.is_published ? "已发布" : "草稿"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(post)}>编辑</Button>
                  <DeleteButton id={post.id} action={deletePostAction} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground py-12">暂无文章，点击"添加文章"开始</p>
      )}
    </div>
  );
}
