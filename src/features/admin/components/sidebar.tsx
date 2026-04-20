"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { localeConfig, type Locale } from "@/lib/i18n";

const sidebarGroups = [
  {
    label: "内容",
    scope: "market" as const,
    items: [
      { path: "/tools", label: "工具管理" },
      { path: "/events", label: "活动管理" },
      { path: "/news", label: "文章管理" },
    ],
  },
  {
    label: "营销",
    scope: "market" as const,
    items: [
      { path: "/leads", label: "Lead 管理" },
      { path: "/settings", label: "市场设置" },
    ],
  },
  {
    label: "共享库",
    scope: "global" as const,
    items: [
      { path: "/categories", label: "分类管理" },
      { path: "/tags", label: "标签管理" },
    ],
  },
];

export function AdminSidebar({ currentMarket }: { currentMarket: Locale }) {
  const pathname = usePathname();
  const cfg = localeConfig[currentMarket];
  const accent = cfg.accent;

  return (
    <aside className="w-60 border-r bg-muted/30 flex flex-col">
      {/* Top stripe tints the sidebar to match the active market. */}
      <div className={cn("h-1.5 w-full", accent.activeBg)} />

      {/* Brand + active market identity — the thing you see at a glance. */}
      <div className={cn("px-4 py-4 border-b", accent.bg)}>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          AIA Admin Portal
        </div>
        <Link
          href={`/admin/${currentMarket}`}
          className={cn("flex items-center gap-2 font-bold text-lg leading-tight", accent.text)}
        >
          <span className="text-2xl leading-none">{cfg.flag}</span>
          <span>{cfg.marketLabel}</span>
        </Link>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <nav className="flex flex-col gap-4">
          {sidebarGroups.map((group) => (
            <div key={group.label}>
              <div className="px-3 mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                <span>{group.label}</span>
                {group.scope === "global" && (
                  <span className="text-[9px] font-mono bg-muted px-1 py-0.5 rounded text-muted-foreground/80">
                    GLOBAL
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const href = `/admin/${currentMarket}${item.path}`;
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={item.path}
                      href={href}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-md transition-colors",
                        isActive
                          ? group.scope === "market"
                            ? `${accent.bg} ${accent.text} font-medium`
                            : "bg-muted text-foreground font-medium"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t">
          <Link
            href={`/${currentMarket}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; 返回前台
          </Link>
        </div>
      </div>
    </aside>
  );
}
