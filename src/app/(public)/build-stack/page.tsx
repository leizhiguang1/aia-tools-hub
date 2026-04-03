import { getTools, getCategories } from "@/db/queries";
import { StackBuilder } from "@/components/stack-builder";
import Link from "next/link";

export default async function BuildStackPage() {
  const [tools, categories] = await Promise.all([
    getTools(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative mb-12 text-center max-w-2xl mx-auto pt-8 pb-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-primary/3 to-transparent rounded-3xl" />
        <Link
          href="/"
          className="inline-block text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          &larr; 返回工具列表
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          打造你的 AI 团队清单
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          选择 3-12 个你最爱的 AI 工具，生成专属分享图片
        </p>
      </section>

      <StackBuilder tools={tools} categories={categories} />
    </div>
  );
}
