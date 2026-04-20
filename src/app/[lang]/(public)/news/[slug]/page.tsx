import { getPostBySlug, getTagsForPost } from "@/db/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TagList } from "@/features/public/components/tag-list";
import { getDictionary } from "@/lib/dictionaries";
import { type Locale, localePath, dateLocaleMap } from "@/lib/i18n";
import { isHtmlContent, sanitizeContent } from "@/lib/content";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang as Locale);

  const post = await getPostBySlug(slug, lang);
  if (!post) notFound();

  const tags = await getTagsForPost(post.id);
  const dateFmt = dateLocaleMap[lang as Locale] || "zh-CN";
  const ts = Number(post.published_at);
  const date = new Date(isNaN(ts) ? post.published_at : ts * 1000).toLocaleDateString(dateFmt);

  return (
    <article className="max-w-3xl mx-auto">
      <Link
        href={localePath(lang, "/news")}
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        &larr; {dict.news.back}
      </Link>

      {post.cover_image && (
        <div className="aspect-video overflow-hidden rounded-lg mb-6">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>{date}</span>
        <span>·</span>
        <span>{post.author}</span>
      </div>

      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      <div className="mb-8">
        <TagList tags={tags} max={10} />
      </div>

      {isHtmlContent(post.content) ? (
        <div
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content) }}
        />
      ) : (
        <div className="prose prose-neutral max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      )}
    </article>
  );
}
