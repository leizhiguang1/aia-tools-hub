"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { locales, localeConfig, type Locale } from "@/lib/i18n";

const marketLabels: Record<string, string> = Object.fromEntries(
  locales.map((l) => [l, localeConfig[l].name])
);

const sidebarGroups = [
  {
    label: "内容",
    items: [
      { href: "/admin/tools", label: "工具管理" },
      { href: "/admin/events", label: "活动管理" },
      { href: "/admin/news", label: "文章管理" },
    ],
  },
  {
    label: "分组",
    items: [
      { href: "/admin/categories", label: "分类管理" },
      { href: "/admin/tags", label: "标签管理" },
    ],
  },
  {
    label: "营销",
    items: [
      { href: "/admin/leads", label: "Lead 管理" },
    ],
  },
];

export function AdminSidebar({ currentMarket }: { currentMarket: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchMarket(market: string) {
    document.cookie = `admin_market=${market};path=/;max-age=31536000`;
    router.refresh();
  }

  return (
    <aside className="w-56 border-r bg-muted/30 p-4 flex flex-col">
      <Link href="/admin" className="font-bold text-lg mb-6">
        Admin
      </Link>

      {/* Market selector */}
      <div className="mb-4 px-1">
        <label className="block text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
          Market
        </label>
        <select
          value={currentMarket}
          onChange={(e) => switchMarket(e.target.value)}
          className="w-full text-sm border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {locales.map((locale) => (
            <option key={locale} value={locale}>
              {marketLabels[locale]}
            </option>
          ))}
        </select>
      </div>

      <nav className="flex flex-col gap-4">
        {sidebarGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
              {group.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
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
    </aside>
  );
}
