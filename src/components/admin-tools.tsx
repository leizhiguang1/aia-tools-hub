"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteButton } from "@/components/admin-delete-button";
import { ToolForm } from "@/components/tool-form";
import { createToolAction, updateToolAction, deleteToolAction } from "@/lib/actions/tools";
import { TagList } from "@/components/tag-list";
import type { Tool, Category, Tag } from "@/types";

interface AdminToolsProps {
  tools: Tool[];
  tagRecord: Record<string, Tag[]>;
  categories: Category[];
  allTags: Tag[];
  translationsRecord: Record<string, Record<string, Record<string, string>>>;
}

export function AdminTools({ tools, tagRecord, categories, allTags, translationsRecord }: AdminToolsProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tool | null>(null);
  const [editingTagIds, setEditingTagIds] = useState<string[]>([]);

  function openCreate() {
    setEditing(null);
    setEditingTagIds([]);
    setOpen(true);
  }

  function openEdit(tool: Tool) {
    setEditing(tool);
    setEditingTagIds((tagRecord[tool.id] || []).map((t) => t.id));
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditing(null);
  }

  const formAction = async (formData: FormData) => {
    if (editing) {
      await updateToolAction(editing.id, formData);
    } else {
      await createToolAction(formData);
    }
    handleClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">工具管理</h1>
        <Button onClick={openCreate}>添加工具</Button>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "编辑工具" : "添加工具"}</DialogTitle>
          </DialogHeader>
          <ToolForm
            key={editing?.id ?? "new"}
            tool={editing}
            categories={categories}
            allTags={allTags}
            selectedTagIds={editingTagIds}
            action={formAction}
            existingTranslations={editing ? translationsRecord[editing.id] || {} : {}}
          />
        </DialogContent>
      </Dialog>

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
              <TableCell>{tool.category_name}</TableCell>
              <TableCell>
                <TagList tags={tagRecord[tool.id] || []} max={2} size="xs" />
              </TableCell>
              <TableCell>{tool.sort_order}</TableCell>
              <TableCell>
                <Badge variant={tool.is_published ? "default" : "outline"}>
                  {tool.is_published ? "已发布" : "草稿"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(tool)}>编辑</Button>
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
