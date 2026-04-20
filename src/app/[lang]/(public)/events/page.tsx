import { getEvents, getTagsForEvents } from "@/db/queries";
import { EventsList } from "@/features/public/components/events-list";
import { getDictionary } from "@/lib/dictionaries";
import { type Locale } from "@/lib/i18n";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const events = await getEvents(lang);
  const tagMap = await getTagsForEvents(events.map((e) => e.id));

  const eventsWithTags = events.map((event) => ({
    ...event,
    tag_list: tagMap.get(event.id) || [],
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">{dict.events.title}</h1>
      <p className="text-muted-foreground mb-6 whitespace-pre-line">{dict.events.description}</p>
      <EventsList events={eventsWithTags} dict={dict} lang={lang} />
    </div>
  );
}
