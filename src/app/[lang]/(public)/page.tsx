import { getTools, getCategories, getTagsForTools, getPopularTools } from "@/db/queries";
import { ToolsGrid } from "@/features/public/components/tools-grid";
import { PopularTools } from "@/features/public/components/popular-tools";
import { getDictionary } from "@/lib/dictionaries";
import { type Locale, localePath } from "@/lib/i18n";
import Link from "next/link";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const [tools, categories, { tools: popularTools }] = await Promise.all([
    getTools(lang),
    getCategories(lang),
    getPopularTools(lang),
  ]);

  const allToolIds = [...new Set([...tools.map((t) => t.id), ...popularTools.map((t) => t.id)])];
  const tagMap = await getTagsForTools(allToolIds);

  const toolsWithTags = tools.map((tool) => ({
    ...tool,
    tag_list: tagMap.get(tool.id) || [],
  }));
  const popularWithTags = popularTools.map((tool) => ({
    ...tool,
    tag_list: tagMap.get(tool.id) || [],
  }));

  return (
    <div>
      {/* Hero Section */}
      <section className="relative mb-10 sm:mb-16 text-center max-w-3xl mx-auto pt-4 sm:pt-8 pb-8 sm:pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-primary/3 to-transparent rounded-3xl" />
        <span className="inline-block text-sm font-medium text-primary/80 bg-primary/10 px-4 py-1.5 rounded-full mb-5">
          {dict.hero.badge}
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {dict.hero.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          {dict.hero.subtitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4">
          <span className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
            {dict.hero.benefit_earn}
          </span>
          <span className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {dict.hero.benefit_calm}
          </span>
          <span className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {dict.hero.benefit_save}
          </span>
        </div>
        <p className="text-sm text-muted-foreground/80 mt-4 leading-relaxed max-w-lg mx-auto">
          {dict.hero.description}
        </p>
        <Link
          href={localePath(lang, "/build-stack")}
          className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          {dict.hero.cta} &rarr;
        </Link>
      </section>

      {popularWithTags.length > 0 && (
        <PopularTools tools={popularWithTags} dict={dict} />
      )}

      <ToolsGrid tools={toolsWithTags} categories={categories} dict={dict} lang={lang} />
    </div>
  );
}
