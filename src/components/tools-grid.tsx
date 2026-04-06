"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TagList } from "@/components/tag-list";
import { VoteButton } from "@/components/vote-button";
import type { Tool, Category } from "@/types";

export function ToolsGrid({
  tools,
  categories,
}: {
  tools: Tool[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = tools.filter((tool) => {
    const matchCategory =
      activeCategory === "all" || tool.category_slug === activeCategory;
    const matchSearch =
      !search ||
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
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
      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="搜索工具..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

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
          所有工具
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
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">暂无工具</p>
      )}
    </div>
  );
}

const pricingLabel: Record<string, { text: string; className: string }> = {
  free: { text: "免费", className: "bg-green-50 text-green-600 ring-green-200" },
  freemium: { text: "免费+付费", className: "bg-blue-50 text-blue-600 ring-blue-200" },
  paid: { text: "付费", className: "bg-amber-50 text-amber-600 ring-amber-200" },
};

function ToolCard({ tool }: { tool: Tool }) {
  const pricing = pricingLabel[tool.pricing] || pricingLabel.freemium;
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col gap-3 rounded-xl bg-card p-4 text-sm text-card-foreground ring-1 ring-foreground/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-foreground/20"
    >
      {/* Pricing pill — top-right */}
      <span
        className={cn(
          "absolute top-3 right-3 text-[10px] font-medium px-2 py-0.5 rounded-full ring-1",
          pricing.className
        )}
      >
        {pricing.text}
      </span>

      {/* Icon + Name */}
      <div className="flex items-center gap-3 pr-16">
        {tool.icon?.startsWith("http") ? (
          <img src={tool.icon} alt="" className="w-10 h-10 rounded-lg object-contain shrink-0" />
        ) : (
          <span className="text-4xl leading-none shrink-0">{tool.icon}</span>
        )}
        <h3 className="font-semibold text-base truncate">{tool.name}</h3>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {tool.description}
      </p>

      {/* Tags + Vote — bottom */}
      <div className="mt-auto pt-1 flex items-center justify-between gap-2">
        {tool.tag_list && tool.tag_list.length > 0 ? (
          <TagList tags={tool.tag_list} max={3} size="xs" />
        ) : (
          <span />
        )}
        <VoteButton toolId={tool.id} initialCount={tool.vote_count ?? 0} />
      </div>
    </a>
  );
}
