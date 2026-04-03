import { getTools, getCategories, getTagsForTools, getPopularTools } from "@/db/queries";
import { ToolsGrid } from "@/components/tools-grid";
import { PopularTools } from "@/components/popular-tools";
import Link from "next/link";

export default async function HomePage() {
  const [tools, categories, popularTools] = await Promise.all([
    getTools(),
    getCategories(),
    getPopularTools(),
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
      <section className="relative mb-16 text-center max-w-3xl mx-auto pt-8 pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-primary/3 to-transparent rounded-3xl" />
        <span className="inline-block text-sm font-medium text-primary/80 bg-primary/10 px-4 py-1.5 rounded-full mb-5">
          不用再乱收藏了没有用到，一次过整理给你
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          一人公司 你的AI团队
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          一套我们团队内部每天用，让你更快完成工作 / 多赚 / 少焦虑 / 省钱的AI工具
        </p>
        <p className="text-sm text-muted-foreground/80 mt-4 leading-relaxed max-w-lg mx-auto">
          在这个AI时代，可以不用很厉害，但至少帮你熟悉摸一遍这些AI工具，以后要用的时候可以在这里找到。我们结合了不同的AI工具搭配你的工作场景和流程，配好给你的工具。
        </p>
        <Link
          href="/build-stack"
          className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          打造你的 AI 团队清单 &rarr;
        </Link>
      </section>

      {popularWithTags.length > 0 && (
        <PopularTools tools={popularWithTags} />
      )}

      <ToolsGrid tools={toolsWithTags} categories={categories} />
    </div>
  );
}
