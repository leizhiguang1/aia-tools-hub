import { getPosts, getTagsForPosts, getBulkTranslations } from "@/db/queries";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { TagList } from "@/components/tag-list";
import { getDictionary } from "@/lib/dictionaries";
import { type Locale, localePath, dateLocaleMap } from "@/lib/i18n";
import { applyBulkTranslations } from "@/lib/translate";

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { lang } = await params;
  const { page: pageStr } = await searchParams;
  const dict = await getDictionary(lang as Locale);

  const page = Math.max(1, parseInt(pageStr || "1", 10));
  const { posts: rawPosts, totalPages } = await getPosts(page, 10);

  const [tagMap, postTransMap] = await Promise.all([
    getTagsForPosts(rawPosts.map((p) => p.id)),
    getBulkTranslations("post", rawPosts.map((p) => p.id), lang),
  ]);

  const translatedPosts = applyBulkTranslations(rawPosts, postTransMap, ["title", "content", "excerpt"]);
  const posts = translatedPosts.map((post) => ({
    ...post,
    tag_list: tagMap.get(post.id) || [],
  }));

  const dateFmt = dateLocaleMap[lang as Locale] || "zh-CN";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{dict.news.title}</h1>

      <div className="space-y-6">
        {posts.map((post) => {
          const date = new Date(Number(post.published_at) * 1000).toLocaleDateString(dateFmt);

          return (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex gap-6">
                  {post.cover_image && (
                    <div className="w-48 h-32 shrink-0 overflow-hidden rounded-md">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <span>{date}</span>
                      <span>·</span>
                      <span>{post.author}</span>
                    </div>
                    <Link href={localePath(lang, `/news/${post.slug}`)}>
                      <h2 className="text-lg font-semibold hover:underline mb-2">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2">
                      <TagList tags={post.tag_list || []} max={3} size="xs" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground py-12">{dict.news.no_articles}</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 && (
            <Link href={localePath(lang, `/news?page=${page - 1}`)} className={buttonVariants({ variant: "outline", size: "sm" })}>{dict.news.prev_page}</Link>
          )}
          <span className="flex items-center px-3 text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link href={localePath(lang, `/news?page=${page + 1}`)} className={buttonVariants({ variant: "outline", size: "sm" })}>{dict.news.next_page}</Link>
          )}
        </div>
      )}
    </div>
  );
}
