import { notFound } from "next/navigation";
import { getAllEvents, getTagsForEvents, getTags } from "@/db/queries";
import { AdminEvents } from "@/features/admin/components/events";
import { isValidLocale } from "@/lib/i18n";
import type { Tag } from "@/types";

export default async function AdminEventsPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isValidLocale(market)) notFound();

  const [events, allTags] = await Promise.all([
    getAllEvents(market),
    getTags(market),
  ]);

  const tagMap = await getTagsForEvents(events.map((e) => e.id));

  const tagRecord: Record<string, Tag[]> = {};
  for (const [key, value] of tagMap) {
    tagRecord[key] = value;
  }

  return (
    <AdminEvents
      events={events}
      tagRecord={tagRecord}
      allTags={allTags}
      currentMarket={market}
    />
  );
}
