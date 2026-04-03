import { getAllEvents, getTagsForEvents, getTags } from "@/db/queries";
import { AdminEvents } from "@/components/admin-events";

export default async function AdminEventsPage() {
  const [events, allTags] = await Promise.all([
    getAllEvents(),
    getTags(),
  ]);
  const tagMap = await getTagsForEvents(events.map((e) => e.id));

  const tagRecord: Record<string, { id: string; name_zh: string; name_en: string; slug: string; color: string; sort_order: number; created_at: number }[]> = {};
  for (const [key, value] of tagMap) {
    tagRecord[key] = value;
  }

  return (
    <AdminEvents
      events={events}
      tagRecord={tagRecord}
      allTags={allTags}
    />
  );
}
