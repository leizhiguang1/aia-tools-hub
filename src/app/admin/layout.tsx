import { Geist, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/features/admin/components/sidebar";
import { defaultLocale, isValidLocale } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, headerList, cookieStore] = await Promise.all([auth(), headers(), cookies()]);
  const pathname = headerList.get("x-pathname") ?? "";
  const isLoginPage = pathname === "/admin/login";
  const marketCookie = cookieStore.get("admin_market")?.value;
  const currentMarket = marketCookie && isValidLocale(marketCookie) ? marketCookie : defaultLocale;

  // Defense in depth: proxy.ts also blocks unauthenticated /admin/* requests,
  // but if anything slips past (stale build, misconfigured matcher, etc.) the
  // layout redirects to login instead of silently rendering a chrome-less page.
  if (!session && !isLoginPage) {
    redirect("/admin/login");
  }

  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex min-h-screen">
          {session && <AdminSidebar currentMarket={currentMarket} />}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
