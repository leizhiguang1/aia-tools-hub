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
    <form action={action} className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title_zh">标题（中文）</Label>
        <Input id="title_zh" name="title_zh" defaultValue={event?.title_zh} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title_en">标题（英文）</Label>
        <Input id="title_en" name="title_en" defaultValue={event?.title_en} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description_zh">简介（中文）</Label>
        <Textarea id="description_zh" name="description_zh" defaultValue={event?.description_zh} rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description_en">简介（英文）</Label>
        <Textarea id="description_en" name="description_en" defaultValue={event?.description_en} rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content_zh">详细内容（中文 Markdown）</Label>
        <Textarea id="content_zh" name="content_zh" defaultValue={event?.content_zh} rows={8} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content_en">详细内容（英文 Markdown）</Label>
        <Textarea id="content_en" name="content_en" defaultValue={event?.content_en} rows={8} />
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
          defaultChecked={event?.is_published !== 0}
          className="rounded"
        />
        <Label htmlFor="is_published">发布</Label>
      </div>

      <Button type="submit">{event ? "保存修改" : "创建活动"}</Button>
    </form>
  );
}
