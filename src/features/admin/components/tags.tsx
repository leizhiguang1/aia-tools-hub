"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { MarketChip } from "@/features/admin/components/market-chip";
import { cn } from "@/lib/utils";
import { TAG_COLORS, TAG_COLOR_NAMES, getTagColorStyle } from "@/lib/tag-colors";
import { createTagAction, updateTagAction, deleteTagAction } from "@/features/admin/actions/tags";
import type { Tag } from "@/types";

export function AdminTags({
  tags,
  currentMarket,
}: {
  tags: Tag[];
  currentMarket: string;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [selectedColor, setSelectedColor] = useState("blue");

  function openCreate() {
    setEditing(null);
    setSelectedColor("blue");
    setOpen(true);
  }

  function openEdit(tag: Tag) {
    setEditing(tag);
    setSelectedColor(tag.color || "default");
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditing(null);
  }

  const formAction = async (formData: FormData) => {
    formData.set("color", selectedColor);
    if (editing) {
      await updateTagAction(editing.id, formData);
    } else {
      formData.set("market_id", currentMarket);
      await createTagAction(formData);
    }
    handleClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">标签管理</h1>
          <MarketChip market={currentMarket} />
        </div>
        <Button onClick={openCreate}>添加标签</Button>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{editing ? "编辑标签" : "添加标签"}</span>
              <MarketChip market={currentMarket} />
            </DialogTitle>
          </DialogHeader>
          <form action={formAction} className="space-y-4" key={editing?.id ?? "new"}>
            <div className="space-y-2">
              <Label htmlFor="name">名称</Label>
              <Input id="name" name="name" required defaultValue={editing?.name} placeholder="主要用" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" required defaultValue={editing?.slug} placeholder="primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>颜色</Label>
                <div className="flex flex-wrap gap-1.5">
                  {TAG_COLOR_NAMES.map((name) => {
                    const c = TAG_COLORS[name];
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedColor(name)}
                        className={cn(
                          "w-7 h-7 rounded-md transition-all border text-[10px] font-medium",
                          selectedColor === name ? "ring-2 ring-offset-1 ring-offset-background ring-foreground scale-110" : "hover:scale-105"
                        )}
                        style={{ backgroundColor: c.bg, borderColor: c.ring, color: c.text }}
                        title={name}
                      >
                        {selectedColor === name ? "✓" : ""}
                      </button>
                    );
                  })}
                </div>
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
            <TableHead>标签</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="w-16 text-center">排序</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" style={getTagColorStyle(tag.color)}>
                    {tag.name}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">{tag.slug}</TableCell>
              <TableCell className="text-center">{tag.sort_order}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
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
