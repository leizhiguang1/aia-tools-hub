"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/tag-input";
import type { Event, Tag } from "@/types";

export function EventForm({
  event,
  allTags,
  selectedTagIds = [],
  action,
}: {
  event?: Event | null;
  allTags: Tag[];
  selectedTagIds?: string[];
  action: (formData: FormData) => Promise<void>;
}) {

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">标题</Label>
        <Input id="title" name="title" defaultValue={event?.title} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">简介</Label>
        <Textarea id="description" name="description" defaultValue={event?.description} rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">详细内容（Markdown）</Label>
        <Textarea id="content" name="content" defaultValue={event?.content} rows={8} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date_start">开始日期</Label>
          <Input id="date_start" name="date_start" type="date" defaultValue={event?.date_start} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date_end">结束日期</Label>
          <Input id="date_end" name="date_end" type="date" defaultValue={event?.date_end} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">地点</Label>
          <Input id="location" name="location" defaultValue={event?.location} placeholder="线上 / 地点" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="external_url">报名链接</Label>
          <Input id="external_url" name="external_url" type="url" defaultValue={event?.external_url} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover_image">封面图片 URL</Label>
        <Input id="cover_image" name="cover_image" defaultValue={event?.cover_image} />
      </div>

      <div className="space-y-2">
        <Label>标签</Label>
        <TagInput allTags={allTags} selectedTagIds={selectedTagIds} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_published"
          name="is_published"
          defaultChecked={event?.is_published !== false}
          className="rounded"
        />
        <Label htmlFor="is_published">发布</Label>
      </div>

      <Button type="submit">{event ? "保存修改" : "创建活动"}</Button>
    </form>
  );
}
