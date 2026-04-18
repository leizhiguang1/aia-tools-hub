"use client";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { getTagColorStyle } from "@/lib/tag-colors";
import type { Tag } from "@/types";

export function TagList({
  tags,
  max = 2,
  size = "sm",
}: {
  tags: Tag[];
  max?: number;
  size?: "sm" | "xs";
}) {
  if (!tags || tags.length === 0) return null;

  const visible = tags.slice(0, max);
  const rest = tags.slice(max);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  function handleEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }

  function handleLeave() {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }

  const badgeClass = size === "xs" ? "text-[11px] px-1.5 py-0" : "text-xs";

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visible.map((tag) => (
        <Badge
          key={tag.id}
          variant="outline"
          className={badgeClass}
          style={getTagColorStyle(tag.color)}
        >
          {tag.name}
        </Badge>
      ))}
      {rest.length > 0 && (
        <div
          className="relative"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <span className="text-xs text-muted-foreground cursor-default hover:text-foreground transition-colors">
            +{rest.length}
          </span>
          {open && (
            <div
              className="absolute left-0 top-full mt-1 z-50 p-2 rounded-lg border bg-popover shadow-md"
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              <div className="flex flex-wrap gap-1 max-w-[200px]">
                {rest.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className={badgeClass}
                    style={getTagColorStyle(tag.color)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
