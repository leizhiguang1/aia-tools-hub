"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/tag-input";
import type { Post, Tag } from "@/types";

export function PostForm({
  post,
  allTags,
  selectedTagIds = [],
  action,
}: {
  post?: Post | null;
  allTags: Tag[];
  selectedTagIds?: string[];
  action: (formData: FormData) => Promise<void>;
}) {

  return (
    <form action={action} className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title_zh">标题（中文）</Label>
        <Input id="title_zh" name="title_zh" defaultValue={post?.title_zh} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title_en">标题（英文）</Label>
        <Input id="title_en" name="title_en" defaultValue={post?.title_en} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <Input id="slug" name="slug" defaultValue={post?.slug} required placeholder="my-post-title" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt_zh">摘要（中文）</Label>
        <Textarea id="excerpt_zh" name="excerpt_zh" defaultValue={post?.excerpt_zh} rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt_en">摘要（英文）</Label>
        <Textarea id="excerpt_en" name="excerpt_en" defaultValue={post?.excerpt_en} rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content_zh">内容（中文 Markdown）</Label>
        <Textarea id="content_zh" name="content_zh" defaultValue={post?.content_zh} rows={12} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content_en">内容（英文 Markdown）</Label>
        <Textarea id="content_en" name="content_en" defaultValue={post?.content_en} rows={12} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author">作者</Label>
          <Input id="author" name="author" defaultValue={post?.author || "FunnelDuo"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cover_image">封面图片 URL</Label>
          <Input id="cover_image" name="cover_image" defaultValue={post?.cover_image} />
        </div>
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
          defaultChecked={post?.is_published !== 0}
          className="rounded"
        />
        <Label htmlFor="is_published">发布</Label>
      </div>

      <Button type="submit">{post ? "保存修改" : "创建文章"}</Button>
    </form>
  );
}
