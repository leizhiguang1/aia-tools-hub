import { getEvents, getTagsForEvents } from "@/db/queries";
import { EventsList } from "@/components/events-list";


export default async function EventsPage() {
  const events = await getEvents();
  const tagMap = await getTagsForEvents(events.map((e) => e.id));
  const eventsWithTags = events.map((event) => ({
    ...event,
    tag_list: tagMap.get(event.id) || [],
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">活动与课程</h1>
      <EventsList events={eventsWithTags} />
    </div>
  );
}
