import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

function getExpectedPassword(): string | undefined {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV === "development") return "admin123";
  return undefined;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const password = credentials?.password as string | undefined;
        const expected = getExpectedPassword();
        if (!password || !expected || password !== expected) return null;

        return { id: "admin", name: "Admin" };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isAdmin = request.nextUrl.pathname.startsWith("/admin");
      const isLogin = request.nextUrl.pathname === "/admin/login";
      if (isAdmin && !isLogin && !auth) return false;
      return true;
    },
  },
});
