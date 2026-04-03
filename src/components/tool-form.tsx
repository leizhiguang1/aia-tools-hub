"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/tag-input";
import type { Tool, Category, Tag } from "@/types";

export function ToolForm({
  tool,
  categories,
  allTags,
  selectedTagIds = [],
  action,
}: {
  tool?: Tool | null;
  categories: Category[];
  allTags: Tag[];
  selectedTagIds?: string[];
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">工具名称</Label>
          <Input id="name" name="name" defaultValue={tool?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">图标 (emoji 或 URL)</Label>
          <Input id="icon" name="icon" defaultValue={tool?.icon} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">链接 URL</Label>
        <Input id="url" name="url" type="url" defaultValue={tool?.url} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description_zh">描述（中文）</Label>
        <Textarea id="description_zh" name="description_zh" defaultValue={tool?.description_zh} rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description_en">描述（英文）</Label>
        <Textarea id="description_en" name="description_en" defaultValue={tool?.description_en} rows={2} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category_id">分类</Label>
          <Select name="category_id" defaultValue={tool?.category_id}>
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name_zh}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sort_order">排序</Label>
          <Input id="sort_order" name="sort_order" type="number" defaultValue={tool?.sort_order ?? 0} />
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
          defaultChecked={tool?.is_published !== 0}
          className="rounded"
        />
        <Label htmlFor="is_published">发布</Label>
      </div>

      <Button type="submit">{tool ? "保存修改" : "创建工具"}</Button>
    </form>
  );
}
