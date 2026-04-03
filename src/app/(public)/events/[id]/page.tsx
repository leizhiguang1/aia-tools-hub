import { getEventById, getTagsForEvent } from "@/db/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event, tags] = await Promise.all([getEventById(id), getTagsForEvent(id)]);
  if (!event) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/events"
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        &larr; 返回活动列表
      </Link>

      {event.cover_image && (
        <div className="aspect-video overflow-hidden rounded-lg mb-6">
          <img
            src={event.cover_image}
            alt={event.title_zh}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-3">{event.title_zh}</h1>

      <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-muted-foreground">
        <span>
          {event.date_start}
          {event.date_end && event.date_end !== event.date_start
            ? ` ~ ${event.date_end}`
            : ""}
        </span>
        {event.location && (
          <>
            <span>·</span>
            <span>{event.location}</span>
          </>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            style={tag.color ? { backgroundColor: tag.color, color: "#fff", borderColor: tag.color } : undefined}
          >
            {tag.name_zh}
          </Badge>
        ))}
      </div>

      {event.external_url && (
        <a href={event.external_url} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), "mb-6")}>
            立即报名
          </a>
      )}

      <div className="prose prose-neutral max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {event.content_zh || event.description_zh}
        </ReactMarkdown>
      </div>
    </div>
  );
}
