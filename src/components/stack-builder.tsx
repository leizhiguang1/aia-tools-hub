"use client";

import { useState, useCallback, useRef } from "react";
import { toPng } from "html-to-image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { StackPreview } from "@/components/stack-preview";
import type { Tool, Category } from "@/types";

const MAX_TOOLS = 16;
const MIN_TOOLS = 3;

// Soft pastel colors for category rows
const CATEGORY_COLORS = [
  { bg: "#EEF2FF", accent: "#6366F1" }, // indigo
  { bg: "#FFF7ED", accent: "#F97316" }, // orange
  { bg: "#F0FDF4", accent: "#22C55E" }, // green
  { bg: "#FEF2F2", accent: "#EF4444" }, // red
  { bg: "#FDF4FF", accent: "#A855F7" }, // purple
  { bg: "#ECFEFF", accent: "#06B6D4" }, // cyan
  { bg: "#FFFBEB", accent: "#EAB308" }, // yellow
  { bg: "#FFF1F2", accent: "#FB7185" }, // pink
  { bg: "#F0F9FF", accent: "#0EA5E9" }, // sky
  { bg: "#F5F3FF", accent: "#8B5CF6" }, // violet
];

export function StackBuilder({
  tools,
  categories,
}: {
  tools: Tool[];
  categories: Category[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleTool = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_TOOLS) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const filtered = tools.filter((tool) => {
    const matchCategory =
      activeCategory === "all" || tool.category_slug === activeCategory;
    const matchSearch =
      !search ||
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const grouped = new Map<string, Tool[]>();
  for (const tool of filtered) {
    const key = tool.category_slug || "other";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(tool);
  }

  // Group selected tools by category for the card
  const selectedTools = tools.filter((t) => selected.has(t.id));
  const selectedGrouped = new Map<string, Tool[]>();
  for (const tool of selectedTools) {
    const key = tool.category_name || "其他";
    if (!selectedGrouped.has(key)) selectedGrouped.set(key, []);
    selectedGrouped.get(key)!.push(tool);
  }

  const handleGenerate = async () => {
    if (selected.size < MIN_TOOLS || !cardRef.current) return;
    setGenerating(true);
    try {
      // Run toPng twice — first call warms up image/font caches so the
      // second call captures a fully-rendered card (fixes missing QR on
      // some browsers).
      await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
      });
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
      });
      setImageUrl(dataUrl);
    } catch (err) {
      console.error(err);
      alert("图片生成失败，请稍后再试");
    } finally {
      setGenerating(false);
    }
  };

  const handleClosePreview = () => {
    setImageUrl(null);
  };

  return (
    <div className="pb-28">
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

      {/* Tools Grid */}
      {Array.from(grouped.entries()).map(([slug, categoryTools]) => {
        const category = categories.find((c) => c.slug === slug);
        return (
          <section key={slug} className="mb-10">
            {activeCategory === "all" && (
              <h2 className="text-lg font-semibold mb-4 border-l-4 border-primary pl-3">
                {category?.name || slug}
              </h2>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categoryTools.map((tool) => {
                const isSelected = selected.has(tool.id);
                const atLimit = selected.size >= MAX_TOOLS && !isSelected;
                return (
                  <button
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    disabled={atLimit}
                    className={cn(
                      "relative flex flex-col items-center gap-2 rounded-xl p-4 text-sm ring-1 transition-all duration-200 text-left",
                      isSelected
                        ? "bg-primary/10 ring-primary ring-2 shadow-md"
                        : "bg-card ring-foreground/10 hover:ring-foreground/20 hover:shadow-sm",
                      atLimit && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    {/* Checkbox indicator */}
                    <div
                      className={cn(
                        "absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    {/* Icon */}
                    {tool.icon?.startsWith("http") ? (
                      <img
                        src={tool.icon}
                        alt=""
                        className="w-10 h-10 rounded-lg object-contain"
                      />
                    ) : (
                      <span className="text-3xl leading-none">{tool.icon}</span>
                    )}

                    {/* Name */}
                    <span className="font-medium text-center text-sm truncate w-full">
                      {tool.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">暂无工具</p>
      )}

      {/* Hidden Card for Image Generation */}
      <div style={{ position: "fixed", left: 0, top: 0, zIndex: -1, opacity: 0, pointerEvents: "none" }}>
        <div
          ref={cardRef}
          style={{
            width: "540px",
            padding: "40px 32px 32px",
            background: "linear-gradient(180deg, #fafbff 0%, #f0f4ff 100%)",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif',
          }}
        >
          {/* Card Title */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: "#1e293b",
                lineHeight: 1.3,
                marginBottom: "4px",
              }}
            >
              <span style={{ color: "#6366f1" }}>一人公司</span> 你的AI团队
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#94a3b8",
                marginTop: "8px",
              }}
            >
              {selectedTools.length} 个精选 AI 工具，助我一人成团队
            </div>
          </div>

          {/* Category Rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Array.from(selectedGrouped.entries()).map(
              ([categoryName, catTools], idx) => {
                const color =
                  CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                return (
                  <div
                    key={categoryName}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    {/* Category Label */}
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: color.accent,
                        whiteSpace: "nowrap",
                        width: "72px",
                        flexShrink: 0,
                        textAlign: "right",
                      }}
                    >
                      {categoryName}
                    </div>

                    {/* Tools in row */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        flex: 1,
                      }}
                    >
                      {catTools.map((tool) => (
                        <div
                          key={tool.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            background: color.bg,
                            borderRadius: "10px",
                            padding: "8px 12px",
                          }}
                        >
                          {tool.icon?.startsWith("http") ? (
                            <img
                              src={tool.icon}
                              alt=""
                              width={24}
                              height={24}
                              style={{
                                borderRadius: "6px",
                                objectFit: "contain",
                              }}
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <span style={{ fontSize: "20px", lineHeight: 1 }}>
                              {tool.icon}
                            </span>
                          )}
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#334155",
                            }}
                          >
                            {tool.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #e2e8f0",
              paddingTop: "20px",
              marginTop: "28px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: "2px",
                }}
              >
                我的 AI 工作栈
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                扫码探索更多 AI 工具
              </div>
            </div>
            <img
              src="/images/qr-share.png"
              alt="QR"
              width={72}
              height={72}
              style={{ borderRadius: "8px" }}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t shadow-lg z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            已选{" "}
            <span className="font-bold text-foreground">{selected.size}</span> /{" "}
            {MAX_TOOLS} 个工具
            {selected.size < MIN_TOOLS && selected.size > 0 && (
              <span className="ml-2 text-amber-500">
                （至少选 {MIN_TOOLS} 个）
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {selected.size > 0 && (
              <button
                onClick={() => setSelected(new Set())}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                清空
              </button>
            )}
            <button
              onClick={handleGenerate}
              disabled={selected.size < MIN_TOOLS || generating}
              className={cn(
                "px-6 py-2.5 rounded-lg font-medium text-sm transition-all",
                selected.size >= MIN_TOOLS
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {generating ? "生成中..." : "生成图片"}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {imageUrl && (
        <StackPreview imageUrl={imageUrl} onClose={handleClosePreview} />
      )}
    </div>
  );
}
