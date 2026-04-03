"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteButton } from "@/components/admin-delete-button";
import { createTagAction, updateTagAction, deleteTagAction } from "@/lib/actions/tags";
import type { Tag } from "@/types";

export function AdminTags({ tags }: { tags: Tag[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(tag: Tag) {
    setEditing(tag);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditing(null);
  }

  const formAction = async (formData: FormData) => {
    if (editing) {
      await updateTagAction(editing.id, formData);
    } else {
      await createTagAction(formData);
    }
    handleClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">标签管理</h1>
        <Button onClick={openCreate}>添加标签</Button>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "编辑标签" : "添加标签"}</DialogTitle>
          </DialogHeader>
          <form action={formAction} className="space-y-4" key={editing?.id ?? "new"}>
            <div className="space-y-2">
              <Label htmlFor="name_zh">中文名称</Label>
              <Input id="name_zh" name="name_zh" required defaultValue={editing?.name_zh} placeholder="主要用" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_en">English Name</Label>
              <Input id="name_en" name="name_en" defaultValue={editing?.name_en} placeholder="Primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" required defaultValue={editing?.slug} placeholder="primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">颜色</Label>
                <Input id="color" name="color" type="color" defaultValue={editing?.color || "#6366f1"} className="w-16 h-9 p-1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">排序</Label>
                <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} className="w-24" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">{editing ? "保存修改" : "添加"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
                <Badge style={tag.color ? { backgroundColor: tag.color, color: "#fff" } : undefined}>
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
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(tag)}>编辑</Button>
                  <DeleteButton id={tag.id} action={deleteTagAction} />
                </div>
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
