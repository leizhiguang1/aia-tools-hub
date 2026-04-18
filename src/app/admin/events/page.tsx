import { cookies } from "next/headers";
import { getAllEvents, getTagsForEvents, getTags, getBulkAllLocaleTranslations } from "@/db/queries";
import { AdminEvents } from "@/features/admin/components/events";
import { defaultLocale, isValidLocale } from "@/lib/i18n";

export default async function AdminEventsPage() {
  const cookieStore = await cookies();
  const marketCookie = cookieStore.get("admin_market")?.value;
  const currentMarket = marketCookie && isValidLocale(marketCookie) ? marketCookie : defaultLocale;

  const [events, allTags] = await Promise.all([
    getAllEvents(currentMarket),
    getTags(),
  ]);

  const eventIds = events.map((e) => e.id);
  const [tagMap, translationsRecord] = await Promise.all([
    getTagsForEvents(eventIds),
    getBulkAllLocaleTranslations("event", eventIds),
  ]);

  const tagRecord: Record<string, { id: string; name: string; slug: string; color: string; sort_order: number; created_at: string }[]> = {};
  for (const [key, value] of tagMap) {
    tagRecord[key] = value;
  }

  return (
    <AdminEvents
      events={events}
      tagRecord={tagRecord}
      allTags={allTags}
      translationsRecord={translationsRecord}
      currentMarket={currentMarket}
    />
  );
}
