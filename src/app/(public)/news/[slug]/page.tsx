import { getPostBySlug, getTagsForPost } from "@/db/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TagList } from "@/components/tag-list";


export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const tags = await getTagsForPost(post.id);
  const date = new Date(post.published_at * 1000).toLocaleDateString("zh-CN");

  return (
    <article className="max-w-3xl mx-auto">
      <Link
        href="/news"
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        &larr; 返回列表
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

      <div className="prose prose-neutral max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
