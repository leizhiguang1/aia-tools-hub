import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LeadCapture } from "@/components/lead-capture";
import { getDictionary } from "@/lib/dictionaries";
import { type Locale } from "@/lib/i18n";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <Navbar lang={lang} dict={dict} />
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">{children}</main>
      <Footer dict={dict} />
      <LeadCapture lang={lang} dict={dict} />
    </>
  );
}
