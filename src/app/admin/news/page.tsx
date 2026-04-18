import { cookies } from "next/headers";
import { getAllPosts, getTagsForPosts, getTags, getBulkAllLocaleTranslations } from "@/db/queries";
import { AdminNews } from "@/features/admin/components/news";
import { defaultLocale, isValidLocale } from "@/lib/i18n";

export default async function AdminNewsPage() {
  const cookieStore = await cookies();
  const marketCookie = cookieStore.get("admin_market")?.value;
  const currentMarket = marketCookie && isValidLocale(marketCookie) ? marketCookie : defaultLocale;

  const [posts, allTags] = await Promise.all([
    getAllPosts(currentMarket),
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
      currentMarket={currentMarket}
    />
  );
}
