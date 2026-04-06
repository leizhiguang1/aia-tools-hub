"use server";

import { createId } from "@paralleldrive/cuid2";
import { createEvent, updateEvent, deleteEvent, setEventTags } from "@/db/queries";
import { revalidatePath } from "next/cache";

function parseTagIds(formData: FormData): string[] {
  try {
    return JSON.parse((formData.get("tag_ids") as string) || "[]");
  } catch {
    return [];
  }
}

export async function createEventAction(formData: FormData) {
  const id = createId();
  await createEvent({
    id,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || "",
    content: (formData.get("content") as string) || "",
    cover_image: (formData.get("cover_image") as string) || "",
    date_start: formData.get("date_start") as string,
    date_end: (formData.get("date_end") as string) || "",
    location: (formData.get("location") as string) || "",
    external_url: (formData.get("external_url") as string) || "",
    is_published: formData.get("is_published") === "on" ? true : false,
  });
  await setEventTags(id, parseTagIds(formData));
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

export async function updateEventAction(id: string, formData: FormData) {
  await updateEvent(id, {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || "",
    content: (formData.get("content") as string) || "",
    cover_image: (formData.get("cover_image") as string) || "",
    date_start: formData.get("date_start") as string,
    date_end: (formData.get("date_end") as string) || "",
    location: (formData.get("location") as string) || "",
    external_url: (formData.get("external_url") as string) || "",
    is_published: formData.get("is_published") === "on" ? true : false,
  });
  await setEventTags(id, parseTagIds(formData));
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

export async function deleteEventAction(id: string) {
  await deleteEvent(id);
  revalidatePath("/events");
  revalidatePath("/admin/events");
}
