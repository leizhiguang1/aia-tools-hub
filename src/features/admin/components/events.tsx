"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { EventForm } from "@/features/admin/components/event-form";
import { createEventAction, updateEventAction, deleteEventAction } from "@/features/admin/actions/events";
import type { Event, Tag } from "@/types";

interface AdminEventsProps {
  events: Event[];
  tagRecord: Record<string, Tag[]>;
  allTags: Tag[];
  translationsRecord: Record<string, Record<string, Record<string, string>>>;
  currentMarket: string;
}

export function AdminEvents({ events, tagRecord, allTags, translationsRecord, currentMarket }: AdminEventsProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [editingTagIds, setEditingTagIds] = useState<string[]>([]);

  function openCreate() {
    setEditing(null);
    setEditingTagIds([]);
    setOpen(true);
  }

  function openEdit(event: Event) {
    setEditing(event);
    setEditingTagIds((tagRecord[event.id] || []).map((t) => t.id));
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditing(null);
  }

  const formAction = async (formData: FormData) => {
    if (editing) {
      await updateEventAction(editing.id, formData);
    } else {
      formData.set("market_id", currentMarket);
      await createEventAction(formData);
    }
    handleClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">活动管理</h1>
        <Button onClick={openCreate}>添加活动</Button>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "编辑活动" : "添加活动"}</DialogTitle>
          </DialogHeader>
          <EventForm
            key={editing?.id ?? "new"}
            event={editing}
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
            <TableHead>标题</TableHead>
            <TableHead>地点</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                <Badge variant={event.is_published ? "default" : "outline"}>
                  {event.is_published ? "已发布" : "草稿"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(event)}>编辑</Button>
                  <DeleteButton id={event.id} action={deleteEventAction} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {events.length === 0 && (
        <p className="text-center text-muted-foreground py-12">暂无活动，点击"添加活动"开始</p>
      )}
    </div>
  );
}
