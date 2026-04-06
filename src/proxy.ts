import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, isValidLocale } from "@/lib/i18n";

function detectLocale(request: NextRequest): string {
  // 1. Check cookie
  const cookieLocale = request.cookies.get("locale")?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) return cookieLocale;

  // 2. Check Accept-Language header
  const acceptLang = request.headers.get("Accept-Language");
  if (acceptLang) {
    for (const locale of locales) {
      if (acceptLang.includes(locale)) return locale;
    }
  }

  return defaultLocale;
}

// Use NextAuth's auth as the base middleware (handles admin auth via the
// `authorized` callback in auth.ts), then layer locale detection on top.
export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;

  // Files served from /public (avoid locale redirect e.g. /logo.png -> /en/logo.png)
  if (/\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json|webmanifest)$/i.test(pathname)) {
    return NextResponse.next();
  }

  // Admin, API, and static routes — already handled by auth or don't need locale
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Check if locale is already in the path
  const firstSegment = pathname.split("/")[1];
  if (isValidLocale(firstSegment)) {
    return NextResponse.next();
  }

  // Redirect to detected locale
  const locale = detectLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  newUrl.search = request.nextUrl.search;
  return NextResponse.redirect(newUrl);
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|images/).*)"],
};
