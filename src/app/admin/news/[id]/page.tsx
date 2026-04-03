import { getPostById, getTags, getTagsForPost } from "@/db/queries";
import { updatePostAction } from "@/lib/actions/posts";
import { PostForm } from "@/components/post-form";
import { notFound } from "next/navigation";


export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, allTags, postTags] = await Promise.all([
    getPostById(id),
    getTags(),
    getTagsForPost(id),
  ]);

  if (!post) notFound();

  const action = updatePostAction.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">编辑文章</h1>
      <PostForm post={post} allTags={allTags} selectedTagIds={postTags.map((t) => t.id)} action={action} />
    </div>
  );
}
