import { notFound } from "next/navigation";
import { getAllPosts, getTagsForPosts, getTags } from "@/db/queries";
import { AdminNews } from "@/features/admin/components/news";
import { isValidLocale } from "@/lib/i18n";
import type { Tag } from "@/types";

export default async function AdminNewsPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isValidLocale(market)) notFound();

  const [posts, allTags] = await Promise.all([
    getAllPosts(market),
    getTags(market),
  ]);

  const tagMap = await getTagsForPosts(posts.map((p) => p.id));

  const tagRecord: Record<string, Tag[]> = {};
  for (const [key, value] of tagMap) {
    tagRecord[key] = value;
  }

  return (
    <AdminNews
      posts={posts}
      tagRecord={tagRecord}
      allTags={allTags}
      currentMarket={market}
    />
  );
}
