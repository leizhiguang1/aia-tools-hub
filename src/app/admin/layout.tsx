import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const sidebarItems = [
  { href: "/admin/tools", label: "工具管理" },
  { href: "/admin/categories", label: "分类管理" },
  { href: "/admin/tags", label: "标签管理" },
  { href: "/admin/events", label: "活动管理" },
  { href: "/admin/news", label: "文章管理" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Allow login page without auth
  return (
    <div className="flex min-h-screen">
      {session && (
        <aside className="w-56 border-r bg-muted/30 p-4 flex flex-col">
          <Link href="/admin" className="font-bold text-lg mb-6">
            Admin
          </Link>
          <nav className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              >
                {item.label}
              </Link>
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
      )}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
