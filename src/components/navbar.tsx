"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "找工具" },
  { href: "/events", label: "看活动" },
  { href: "/news", label: "看新鲜事" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="font-bold text-lg">
          我的 AI 工作栈
        </Link>
        <nav className="flex-1 flex items-center justify-center gap-1">
          {navItems.map((item) => {
            const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
            const isActive =
              item.href === "/"
                ? normalizedPathname === "/"
                : normalizedPathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-1.5 text-sm transition-colors border-b-2",
                  isActive
                    ? "border-primary text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
