import { getTags } from "@/db/queries";
import { createEventAction } from "@/lib/actions/events";
import { EventForm } from "@/components/event-form";

export default async function NewEventPage() {
  const allTags = await getTags();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">添加活动</h1>
      <EventForm allTags={allTags} action={createEventAction} />
    </div>
  );
}
