import { getEventById, getTags, getTagsForEvent } from "@/db/queries";
import { updateEventAction } from "@/lib/actions/events";
import { EventForm } from "@/components/event-form";
import { notFound } from "next/navigation";


export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event, allTags, eventTags] = await Promise.all([
    getEventById(id),
    getTags(),
    getTagsForEvent(id),
  ]);

  if (!event) notFound();

  const action = updateEventAction.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">编辑活动</h1>
      <EventForm event={event} allTags={allTags} selectedTagIds={eventTags.map((t) => t.id)} action={action} />
    </div>
  );
}
