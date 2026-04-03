"use server";

import { createId } from "@paralleldrive/cuid2";
import { createEvent, updateEvent, deleteEvent, setEventTags } from "@/db/queries";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
    title_zh: formData.get("title_zh") as string,
    title_en: (formData.get("title_en") as string) || "",
    description_zh: formData.get("description_zh") as string,
    description_en: (formData.get("description_en") as string) || "",
    content_zh: (formData.get("content_zh") as string) || "",
    content_en: (formData.get("content_en") as string) || "",
    cover_image: (formData.get("cover_image") as string) || "",
    date_start: formData.get("date_start") as string,
    date_end: (formData.get("date_end") as string) || "",
    location: (formData.get("location") as string) || "",

    external_url: (formData.get("external_url") as string) || "",
    is_published: formData.get("is_published") === "on" ? 1 : 0,
  });
  await setEventTags(id, parseTagIds(formData));
  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function updateEventAction(id: string, formData: FormData) {
  await updateEvent(id, {
    title_zh: formData.get("title_zh") as string,
    title_en: (formData.get("title_en") as string) || "",
    description_zh: formData.get("description_zh") as string,
    description_en: (formData.get("description_en") as string) || "",
    content_zh: (formData.get("content_zh") as string) || "",
    content_en: (formData.get("content_en") as string) || "",
    cover_image: (formData.get("cover_image") as string) || "",
    date_start: formData.get("date_start") as string,
    date_end: (formData.get("date_end") as string) || "",
    location: (formData.get("location") as string) || "",

    external_url: (formData.get("external_url") as string) || "",
    is_published: formData.get("is_published") === "on" ? 1 : 0,
  });
  await setEventTags(id, parseTagIds(formData));
  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function deleteEventAction(id: string) {
  await deleteEvent(id);
  revalidatePath("/events");
  revalidatePath("/admin/events");
}
