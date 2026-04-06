import { getEvents, getTagsForEvents, getBulkTranslations } from "@/db/queries";
import { EventsList } from "@/components/events-list";
import { getDictionary } from "@/lib/dictionaries";
import { type Locale } from "@/lib/i18n";
import { applyBulkTranslations } from "@/lib/translate";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const events = await getEvents();
  const [tagMap, eventTransMap] = await Promise.all([
    getTagsForEvents(events.map((e) => e.id)),
    getBulkTranslations("event", events.map((e) => e.id), lang),
  ]);

  const translatedEvents = applyBulkTranslations(events, eventTransMap, ["title", "description", "content"]);
  const eventsWithTags = translatedEvents.map((event) => ({
    ...event,
    tag_list: tagMap.get(event.id) || [],
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{dict.events.title}</h1>
      <EventsList events={eventsWithTags} dict={dict} lang={lang} />
    </div>
  );
}
