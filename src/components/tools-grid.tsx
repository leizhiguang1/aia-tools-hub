"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
      tool.description_zh.toLowerCase().includes(search.toLowerCase());
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
            {cat.name_zh}
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
                {category?.name_zh || slug}
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

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          {tool.icon?.startsWith("http") ? (
            <img src={tool.icon} alt={tool.name} className="w-8 h-8 object-contain" />
          ) : (
            <span className="text-3xl">{tool.icon}</span>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base">{tool.name}</h3>
              {tool.tag_list?.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-xs"
                  style={tag.color ? { backgroundColor: tag.color, color: "#fff" } : undefined}
                >
                  {tag.name_zh}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {tool.description_zh}
        </p>
        <a href={tool.url} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}>
            访问工具
          </a>
      </CardContent>
    </Card>
  );
}
