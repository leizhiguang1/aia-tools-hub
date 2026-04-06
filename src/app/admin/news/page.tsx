import { getAllPosts, getTagsForPosts, getTags, getTranslations } from "@/db/queries";
import { AdminNews } from "@/components/admin-news";
import { defaultLocale } from "@/lib/i18n";

export default async function AdminNewsPage() {
  const [posts, allTags] = await Promise.all([
    getAllPosts(),
    getTags(),
  ]);
  const tagMap = await getTagsForPosts(posts.map((p) => p.id));

  const tagRecord: Record<string, { id: string; name: string; slug: string; color: string; sort_order: number; created_at: string }[]> = {};
  for (const [key, value] of tagMap) {
    tagRecord[key] = value;
  }

  const translationsRecord: Record<string, Record<string, Record<string, string>>> = {};
  for (const post of posts) {
    const trans = await getTranslations("post", post.id);
    const byLocale: Record<string, Record<string, string>> = {};
    for (const t of trans) {
      if (t.locale === defaultLocale) continue;
      if (!byLocale[t.locale]) byLocale[t.locale] = {};
      byLocale[t.locale][t.field] = t.value;
    }
    if (Object.keys(byLocale).length > 0) {
      translationsRecord[post.id] = byLocale;
    }
  }

  return (
    <AdminNews
      posts={posts}
      tagRecord={tagRecord}
      allTags={allTags}
      translationsRecord={translationsRecord}
    />
  );
}
