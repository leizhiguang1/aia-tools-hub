"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { MarketChip } from "@/features/admin/components/market-chip";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/features/admin/actions/categories";
import type { Category } from "@/types";

export function AdminCategories({
  categories,
  currentMarket,
}: {
  categories: Category[];
  currentMarket: string;
}) {
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
      formData.set("market_id", currentMarket);
      await createCategoryAction(formData);
    }
    handleClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">分类管理</h1>
          <MarketChip market={currentMarket} />
        </div>
        <Button onClick={openCreate}>添加分类</Button>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{editing ? "编辑分类" : "添加分类"}</span>
              <MarketChip market={currentMarket} />
            </DialogTitle>
          </DialogHeader>
          <form action={formAction} className="space-y-4" key={editing?.id ?? "new"}>
            <div className="space-y-2">
              <Label htmlFor="name">名称</Label>
              <Input id="name" name="name" required defaultValue={editing?.name} placeholder="日常基建与模型" />
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
            <TableHead>名称</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>排序</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>{cat.name}</TableCell>
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
