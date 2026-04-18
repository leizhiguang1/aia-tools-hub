"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TagList } from "@/features/public/components/tag-list";
import { VoteButton } from "@/features/public/components/vote-button";
import { ExternalLink } from "lucide-react";
import type { Tool, Category } from "@/types";
import type { Dictionary } from "@/lib/dictionaries";

export function ToolsGrid({
  tools,
  categories,
  dict,
  lang,
}: {
  tools: Tool[];
  categories: Category[];
  dict: Dictionary;
  lang: string;
}) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = tools.filter((tool) => {
    return activeCategory === "all" || tool.category_slug === activeCategory;
  });

  // Group tools by category for display
  const grouped = new Map<string, Tool[]>();
  for (const tool of filtered) {
    const key = tool.category_slug || "other";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(tool);
  }

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "px-4 py-1.5 text-sm rounded-full border transition-colors",
            activeCategory === "all"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground hover:bg-muted"
          )}
        >
          {dict.tools.all}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            className={cn(
              "px-4 py-1.5 text-sm rounded-full border transition-colors",
              activeCategory === cat.slug
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Tools by Category */}
      {Array.from(grouped.entries()).map(([slug, categoryTools]) => {
        const category = categories.find((c) => c.slug === slug);
        return (
          <section key={slug} className="mb-10">
            {activeCategory === "all" && (
              <h2 className="text-lg font-semibold mb-4 border-l-4 border-primary pl-3">
                {category?.name || slug}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} dict={dict} />
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">{dict.tools.no_tools}</p>
      )}
    </div>
  );
}

function ToolCard({ tool, dict }: { tool: Tool; dict: Dictionary }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col gap-3 rounded-xl bg-card p-4 text-sm text-card-foreground ring-1 ring-foreground/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-foreground/20"
    >
      {/* Icon + Name */}
      <div className="flex items-center gap-3">
        {tool.icon?.startsWith("http") ? (
          <img src={tool.icon} alt="" className="w-10 h-10 rounded-lg object-contain shrink-0" />
        ) : (
          <span className="text-4xl leading-none shrink-0">{tool.icon}</span>
        )}
        <h3 className="font-semibold text-base truncate">{tool.name}</h3>
      </div>

      {/* Tags */}
      {tool.tag_list && tool.tag_list.length > 0 && (
        <TagList tags={tool.tag_list} max={3} size="xs" />
      )}

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {tool.description}
      </p>

      {/* Vote + Visit — bottom */}
      <div className="mt-auto pt-1 flex items-center justify-between gap-2">
        <VoteButton toolId={tool.id} initialCount={tool.vote_count ?? 0} />
        <span
          role="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(tool.url, "_blank", "noopener,noreferrer");
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
        >
          {dict.tools.visit}
          <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </div>
    </a>
  );
}
