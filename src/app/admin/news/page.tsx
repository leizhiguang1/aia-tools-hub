import { getAllPosts, getTagsForPosts, getTags } from "@/db/queries";
import { AdminNews } from "@/components/admin-news";

export default async function AdminNewsPage() {
  const [posts, allTags] = await Promise.all([
    getAllPosts(),
    getTags(),
  ]);
  const tagMap = await getTagsForPosts(posts.map((p) => p.id));

  const tagRecord: Record<string, { id: string; name: string; slug: string; color: string; sort_order: number; created_at: number }[]> = {};
  for (const [key, value] of tagMap) {
    tagRecord[key] = value;
  }

  return (
    <AdminNews
      posts={posts}
      tagRecord={tagRecord}
      allTags={allTags}
    />
  );
}
