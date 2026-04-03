"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r bg-muted/30 p-4 flex flex-col">
      <Link href="/admin" className="font-bold text-lg mb-6">
        Admin
      </Link>
      <nav className="flex flex-col gap-4">
        {sidebarGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {group.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; 返回前台
        </Link>
      </div>
    </aside>
  );
}
