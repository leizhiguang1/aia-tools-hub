import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

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
  const [session, headerList] = await Promise.all([auth(), headers()]);
  const pathname = headerList.get("x-pathname") ?? "";
  const isLoginPage = pathname === "/admin/login";

  // Defense in depth: proxy.ts also blocks unauthenticated /admin/* requests,
  // but if anything slips past (stale build, misconfigured matcher, etc.) the
  // layout redirects to login instead of silently rendering a chrome-less page.
  if (!session && !isLoginPage) {
    redirect("/admin/login");
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
