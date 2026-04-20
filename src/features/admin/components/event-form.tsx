"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/features/admin/components/tag-input";
import { RichTextEditor } from "@/features/admin/components/rich-text-editor";
import { ImageUpload } from "@/features/admin/components/image-upload";
import type { Event, Tag } from "@/types";

export function EventForm({
  event,
  allTags,
  selectedTagIds = [],
  action,
  market,
}: {
  event?: Event | null;
  allTags: Tag[];
  selectedTagIds?: string[];
  action: (formData: FormData) => Promise<void>;
  market: string;
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
        <Label>详细内容</Label>
        <RichTextEditor name="content" initialContent={event?.content || ""} />
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
        <Label>封面图片</Label>
        <ImageUpload name="cover_image" defaultValue={event?.cover_image || ""} folder="cover-images" hint="建议尺寸: 1200 x 675 px (16:9)" />
      </div>

      <div className="space-y-2">
        <Label>标签</Label>
        <TagInput allTags={allTags} selectedTagIds={selectedTagIds} market={market} />
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

      <Button type="submit" size="lg" className="w-full text-base">{event ? "保存修改" : "创建活动"}</Button>
    </form>
  );
}
