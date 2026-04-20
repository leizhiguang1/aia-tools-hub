import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/features/admin/components/login-form";
import { defaultLocale } from "@/lib/i18n";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect(`/admin/${defaultLocale}/tools`);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
}
