import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/features/admin/components/login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/admin/tools");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
}
