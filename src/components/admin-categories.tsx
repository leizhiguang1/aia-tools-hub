"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteButton } from "@/components/admin-delete-button";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/lib/actions/categories";
import type { Category } from "@/types";

export function AdminCategories({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditing(null);
  }

  const formAction = async (formData: FormData) => {
    if (editing) {
      await updateCategoryAction(editing.id, formData);
    } else {
      await createCategoryAction(formData);
    }
    handleClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">分类管理</h1>
        <Button onClick={openCreate}>添加分类</Button>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "编辑分类" : "添加分类"}</DialogTitle>
          </DialogHeader>
          <form action={formAction} className="space-y-4" key={editing?.id ?? "new"}>
            <div className="space-y-2">
              <Label htmlFor="name_zh">中文名称</Label>
              <Input id="name_zh" name="name_zh" required defaultValue={editing?.name_zh} placeholder="日常基建与模型" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_en">English Name</Label>
              <Input id="name_en" name="name_en" defaultValue={editing?.name_en} placeholder="Daily Models" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" required defaultValue={editing?.slug} placeholder="models" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">排序</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} className="w-24" />
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
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(cat)}>编辑</Button>
                  <DeleteButton id={cat.id} action={deleteCategoryAction} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {categories.length === 0 && (
        <p className="text-center text-muted-foreground py-8">暂无分类，请添加</p>
      )}
    </div>
  );
}
