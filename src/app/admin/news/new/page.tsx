import { getTags } from "@/db/queries";
import { createPostAction } from "@/lib/actions/posts";
import { PostForm } from "@/components/post-form";

export default async function NewPostPage() {
  const allTags = await getTags();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">添加文章</h1>
      <PostForm allTags={allTags} action={createPostAction} />
    </div>
  );
}
