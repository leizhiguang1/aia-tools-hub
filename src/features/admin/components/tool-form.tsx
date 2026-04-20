"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/features/admin/components/tag-input";
import { IconPicker } from "@/features/admin/components/icon-picker";
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
          <Label>图标</Label>
          <IconPicker defaultValue={tool?.icon ?? ""} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">链接 URL</Label>
        <div className="flex gap-3 items-center">
          <Input id="url" name="url" type="url" defaultValue={tool?.url} required className="flex-1" />
          {tool?.url && (
            <div className="group relative shrink-0">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(tool.url)}`}
                alt="QR"
                className="w-10 h-10 border rounded-md cursor-pointer bg-white"
              />
              <div className="absolute z-10 hidden group-hover:block top-12 right-0 p-2 bg-white border rounded-lg shadow-xl">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tool.url)}`} className="w-32 h-32" alt="Enlarged QR" />
                <p className="text-xs text-center text-muted-foreground mt-2">右键保存<br/>Right Click to Save</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea id="description" name="description" defaultValue={tool?.description} rows={2} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category_id">分类</Label>
          <Select name="category_id" defaultValue={tool?.category_id}>
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pricing">价格</Label>
          <Select name="pricing" defaultValue={tool?.pricing ?? "freemium"}>
            <SelectTrigger>
              <SelectValue placeholder="选择价格" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">免费 Free</SelectItem>
              <SelectItem value="freemium">免费+付费 Freemium</SelectItem>
              <SelectItem value="paid">付费 Paid</SelectItem>
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
          defaultChecked={tool?.is_published !== false}
          className="rounded"
        />
        <Label htmlFor="is_published">发布</Label>
      </div>

      <Button type="submit" size="lg" className="w-full text-base">{tool ? "保存修改" : "创建工具"}</Button>
    </form>
  );
}
