import { notFound } from "next/navigation";
import { getAllPosts, getTagsForPosts, getTags, getBulkAllLocaleTranslations } from "@/db/queries";
import { AdminNews } from "@/features/admin/components/news";
import { isValidLocale } from "@/lib/i18n";

export default async function AdminNewsPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isValidLocale(market)) notFound();

  const [posts, allTags] = await Promise.all([
    getAllPosts(market),
    getTags(),
  ]);

  const postIds = posts.map((p) => p.id);
  const [tagMap, translationsRecord] = await Promise.all([
    getTagsForPosts(postIds),
    getBulkAllLocaleTranslations("post", postIds),
  ]);

  const tagRecord: Record<string, { id: string; name: string; slug: string; color: string; sort_order: number; created_at: string }[]> = {};
  for (const [key, value] of tagMap) {
    tagRecord[key] = value;
  }

  return (
    <AdminNews
      posts={posts}
      tagRecord={tagRecord}
      allTags={allTags}
      translationsRecord={translationsRecord}
      currentMarket={market}
    />
  );
}
