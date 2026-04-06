"use client";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TAG_COLORS, TAG_COLOR_NAMES, getTagColorStyle } from "@/lib/tag-colors";
import { createTagInlineAction } from "@/lib/actions/tags";
import type { Tag } from "@/types";

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
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("blue");
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
    const trimmed = newName.trim();
    if (!trimmed || creating) return;

    setCreating(true);
    try {
      const tag = await createTagInlineAction({
        name: trimmed,
        color: newColor,
      });
      setTags((prev) => [...prev, tag as Tag]);
      setSelected((prev) => new Set(prev).add(tag.id));
      setNewName("");
      setNewColor("blue");
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
          const style = getTagColorStyle(tag.color);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggle(tag.id)}
              className="focus:outline-none"
            >
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer transition-all",
                  isSelected ? "ring-2 ring-offset-1 ring-offset-background" : "opacity-60 hover:opacity-100"
                )}
                style={{
                  backgroundColor: style.backgroundColor,
                  color: style.color,
                  borderColor: style.borderColor,
                  ...(isSelected ? { ringColor: style.borderColor } as Record<string, string> : {}),
                }}
              >
                {tag.name}
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
              placeholder="标签名称"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); handleCreate(); }
                if (e.key === "Escape") setShowCreate(false);
              }}
              className="h-8 text-sm"
            />
          </div>

          {/* Color picker - Notion-style named colors */}
          <div className="flex flex-wrap gap-1.5">
            {TAG_COLOR_NAMES.map((name) => {
              const c = TAG_COLORS[name];
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setNewColor(name)}
                  className={cn(
                    "w-6 h-6 rounded-full transition-all border",
                    newColor === name ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110" : "hover:scale-110"
                  )}
                  style={{ backgroundColor: c.bg, borderColor: c.ring }}
                  title={name}
                />
              );
            })}
          </div>

          {/* Preview + actions */}
          <div className="flex items-center gap-2">
            {newName.trim() && (
              <Badge
                variant="outline"
                className="pointer-events-none"
                style={getTagColorStyle(newColor)}
              >
                {newName.trim()}
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
              disabled={!newName.trim() || creating}
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
