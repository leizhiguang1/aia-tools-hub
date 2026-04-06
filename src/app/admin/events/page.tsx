import { getAllEvents, getTagsForEvents, getTags, getTranslations } from "@/db/queries";
import { AdminEvents } from "@/components/admin-events";
import { defaultLocale } from "@/lib/i18n";

export default async function AdminEventsPage() {
  const [events, allTags] = await Promise.all([
    getAllEvents(),
    getTags(),
  ]);
  const tagMap = await getTagsForEvents(events.map((e) => e.id));

  const tagRecord: Record<string, { id: string; name: string; slug: string; color: string; sort_order: number; created_at: string }[]> = {};
  for (const [key, value] of tagMap) {
    tagRecord[key] = value;
  }

  const translationsRecord: Record<string, Record<string, Record<string, string>>> = {};
  for (const event of events) {
    const trans = await getTranslations("event", event.id);
    const byLocale: Record<string, Record<string, string>> = {};
    for (const t of trans) {
      if (t.locale === defaultLocale) continue;
      if (!byLocale[t.locale]) byLocale[t.locale] = {};
      byLocale[t.locale][t.field] = t.value;
    }
    if (Object.keys(byLocale).length > 0) {
      translationsRecord[event.id] = byLocale;
    }
  }

  return (
    <AdminEvents
      events={events}
      tagRecord={tagRecord}
      allTags={allTags}
      translationsRecord={translationsRecord}
    />
  );
}
