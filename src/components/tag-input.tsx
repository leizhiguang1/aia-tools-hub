"use client";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createTagInlineAction } from "@/lib/actions/tags";
import type { Tag } from "@/types";

const PRESET_COLORS = [
  "#6366f1", // indigo
  "#3b82f6", // blue
  "#0ea5e9", // sky
  "#10b981", // green
  "#22c55e", // emerald
  "#f59e0b", // amber
  "#f97316", // orange
  "#ef4444", // red
  "#ec4899", // pink
  "#8b5cf6", // purple
  "#64748b", // slate
];

export function TagInput({
  allTags,
  selectedTagIds = [],
  name = "tag_ids",
}: {
  allTags: Tag[];
  selectedTagIds?: string[];
  name?: string;
}) {
  const [tags, setTags] = useState<Tag[]>(allTags);
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedTagIds));
  const [showCreate, setShowCreate] = useState(false);
  const [newNameZh, setNewNameZh] = useState("");
  const [newNameEn, setNewNameEn] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [creating, setCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function toggle(tagId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  }

  async function handleCreate() {
    const trimmed = newNameZh.trim();
    if (!trimmed || creating) return;

    setCreating(true);
    try {
      const tag = await createTagInlineAction({
        name_zh: trimmed,
        name_en: newNameEn.trim(),
        color: newColor,
      });
      setTags((prev) => [...prev, tag as Tag]);
      setSelected((prev) => new Set(prev).add(tag.id));
      setNewNameZh("");
      setNewNameEn("");
      setNewColor(PRESET_COLORS[0]);
      setShowCreate(false);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(Array.from(selected))} />

      <div className="flex flex-wrap gap-2 items-center">
        {tags.map((tag) => {
          const isSelected = selected.has(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggle(tag.id)}
              className="focus:outline-none"
            >
              <Badge
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                style={
                  isSelected && tag.color
                    ? { backgroundColor: tag.color, borderColor: tag.color, color: "#fff" }
                    : tag.color
                    ? { borderColor: tag.color, color: tag.color }
                    : undefined
                }
              >
                {tag.name_zh}
                {tag.name_en && <span className="ml-1 opacity-60 text-xs">({tag.name_en})</span>}
              </Badge>
            </button>
          );
        })}

        {/* Create new tag button */}
        <button
          type="button"
          onClick={() => {
            setShowCreate((v) => !v);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="focus:outline-none"
        >
          <Badge variant="outline" className="cursor-pointer border-dashed text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
            + 新标签
          </Badge>
        </button>
      </div>

      {/* Inline create form */}
      {showCreate && (
        <div className="mt-3 p-3 border rounded-lg bg-muted/30 space-y-3 max-w-sm">
          <div className="space-y-1.5">
            <Input
              ref={inputRef}
              placeholder="标签名称（中文）"
              value={newNameZh}
              onChange={(e) => setNewNameZh(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); handleCreate(); }
                if (e.key === "Escape") setShowCreate(false);
              }}
              className="h-8 text-sm"
            />
            <Input
              placeholder="English name (optional)"
              value={newNameEn}
              onChange={(e) => setNewNameEn(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); handleCreate(); }
                if (e.key === "Escape") setShowCreate(false);
              }}
              className="h-8 text-sm"
            />
          </div>

          {/* Color picker - preset swatches */}
          <div className="flex flex-wrap gap-1.5">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setNewColor(color)}
                className={cn(
                  "w-6 h-6 rounded-full transition-all",
                  newColor === color ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110" : "hover:scale-110"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Preview + actions */}
          <div className="flex items-center gap-2">
            {newNameZh.trim() && (
              <Badge
                variant="default"
                className="pointer-events-none"
                style={{ backgroundColor: newColor, borderColor: newColor, color: "#fff" }}
              >
                {newNameZh.trim()}
                {newNameEn.trim() && <span className="ml-1 opacity-60 text-xs">({newNameEn.trim()})</span>}
              </Badge>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!newNameZh.trim() || creating}
              className="text-xs font-medium text-primary hover:text-primary/80 disabled:opacity-50"
            >
              {creating ? "创建中..." : "创建"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
