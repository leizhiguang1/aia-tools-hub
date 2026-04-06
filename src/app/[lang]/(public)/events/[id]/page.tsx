import { getEventById, getTagsForEvent, getTranslationsForLocale } from "@/db/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { TagList } from "@/components/tag-list";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDictionary } from "@/lib/dictionaries";
import { type Locale, localePath } from "@/lib/i18n";
import { applyTranslations } from "@/lib/translate";
import { isHtmlContent, sanitizeContent } from "@/lib/content";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang as Locale);

  const [event, tags, trans] = await Promise.all([
    getEventById(id),
    getTagsForEvent(id),
    getTranslationsForLocale("event", id, lang),
  ]);
  if (!event) notFound();

  const translated = applyTranslations(event, trans, ["title", "description", "content"]);

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href={localePath(lang, "/events")}
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        &larr; {dict.events.back}
      </Link>

      {translated.cover_image && (
        <div className="aspect-video overflow-hidden rounded-lg mb-6">
          <img
            src={translated.cover_image}
            alt={translated.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold mb-3">{translated.title}</h1>

      {translated.location && (
        <p className="text-sm text-muted-foreground mb-4">{translated.location}</p>
      )}

      <div className="mb-6">
        <TagList tags={tags} max={10} />
      </div>

      {translated.external_url && (
        <div className="mb-8 rounded-xl border-2 border-primary/20 bg-primary/5 p-5 text-center">
          <a
            href={translated.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "text-base px-8 py-5 font-semibold shadow-md hover:shadow-lg transition-shadow"
            )}
          >
            {dict.events.register} &rarr;
          </a>
        </div>
      )}

      {(() => {
        const content = translated.content || translated.description;
        return isHtmlContent(content) ? (
          <div
            className="prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeContent(content) }}
          />
        ) : (
          <div className="prose prose-neutral max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        );
      })()}

      {translated.external_url && (
        <div className="mt-12 mb-8 text-center">
          <a
            href={translated.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "w-full max-w-md text-lg py-6")}
          >
            {dict.events.register} &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
