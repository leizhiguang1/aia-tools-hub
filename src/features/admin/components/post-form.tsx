"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/features/admin/components/tag-input";
import { RichTextEditor } from "@/features/admin/components/rich-text-editor";
import { ImageUpload } from "@/features/admin/components/image-upload";
import { AdminTranslationFields } from "@/features/admin/components/translation-fields";
import type { Post, Tag } from "@/types";

export function PostForm({
  post,
  allTags,
  selectedTagIds = [],
  action,
  existingTranslations = {},
}: {
  post?: Post | null;
  allTags: Tag[];
  selectedTagIds?: string[];
  action: (formData: FormData) => Promise<void>;
  existingTranslations?: Record<string, Record<string, string>>;
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
        <Label>内容</Label>
        <RichTextEditor name="content" initialContent={post?.content || ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">作者</Label>
        <Input id="author" name="author" defaultValue={post?.author || "FunnelDuo"} />
      </div>

      <div className="space-y-2">
        <Label>封面图片</Label>
        <ImageUpload name="cover_image" defaultValue={post?.cover_image || ""} folder="cover-images" hint="建议尺寸: 1200 x 675 px (16:9)" />
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

      <Button type="submit" size="lg" className="w-full text-base">{post ? "保存修改" : "创建文章"}</Button>

      {post && (
        <AdminTranslationFields
          entityType="post"
          entityId={post.id}
          fields={[
            { name: "title", label: "标题 Title", type: "input" },
            { name: "excerpt", label: "摘要 Excerpt", type: "textarea" },
            { name: "content", label: "内容 Content", type: "richtext" },
          ]}
          existingTranslations={existingTranslations}
        />
      )}
    </form>
  );
}
