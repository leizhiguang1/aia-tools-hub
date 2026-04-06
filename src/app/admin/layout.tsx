import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin-sidebar";

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
  const session = await auth();

  return (
    <html
      lang="zh"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex min-h-screen">
          {session && <AdminSidebar />}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
