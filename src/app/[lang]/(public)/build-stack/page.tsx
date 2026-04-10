import { getTools, getCategories, getBulkTranslations } from "@/db/queries";
import { StackBuilder } from "@/components/stack-builder";
import { getDictionary } from "@/lib/dictionaries";
import { type Locale, localePath } from "@/lib/i18n";
import { applyBulkTranslations } from "@/lib/translate";
import Link from "next/link";

export default async function BuildStackPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const [tools, categories] = await Promise.all([
    getTools(),
    getCategories(),
  ]);

  const [toolTransMap, catTransMap] = await Promise.all([
    getBulkTranslations("tool", tools.map((t) => t.id), lang),
    getBulkTranslations("category", categories.map((c) => c.id), lang),
  ]);

  const translatedTools = applyBulkTranslations(tools, toolTransMap, ["name", "description", "url"]);
  const translatedCategories = applyBulkTranslations(categories, catTransMap, ["name"]);

  return (
    <div>
      {/* Hero */}
      <section className="relative mb-12 text-center max-w-2xl mx-auto pt-8 pb-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-primary/3 to-transparent rounded-3xl" />
        <Link
          href={localePath(lang, "/")}
          className="inline-block text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          &larr; {dict.stack.back}
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {dict.stack.title}
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          {dict.stack.subtitle}
        </p>
      </section>

      <StackBuilder tools={translatedTools} categories={translatedCategories} dict={dict} />
    </div>
  );
}
