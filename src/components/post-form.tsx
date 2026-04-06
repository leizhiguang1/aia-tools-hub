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
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">标题</Label>
        <Input id="title" name="title" defaultValue={post?.title} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <Input id="slug" name="slug" defaultValue={post?.slug} required placeholder="my-post-title" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">摘要</Label>
        <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt} rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">内容（Markdown）</Label>
        <Textarea id="content" name="content" defaultValue={post?.content} rows={12} />
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
          defaultChecked={post?.is_published !== false}
          className="rounded"
        />
        <Label htmlFor="is_published">发布</Label>
      </div>

      <Button type="submit">{post ? "保存修改" : "创建文章"}</Button>
    </form>
  );
}
