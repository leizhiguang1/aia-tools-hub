"use server";

import { createId } from "@paralleldrive/cuid2";
import { createEvent, updateEvent, deleteEvent, setEventTags } from "@/db/queries";
import { revalidatePath } from "next/cache";
import { locales } from "@/lib/i18n";

function parseTagIds(formData: FormData): string[] {
  try {
    return JSON.parse((formData.get("tag_ids") as string) || "[]");
  } catch {
    return [];
  }
}

function revalidateAll() {
  for (const locale of locales) revalidatePath(`/${locale}/events`);
  revalidatePath("/admin/[market]/events", "page");
}

export async function createEventAction(formData: FormData) {
  const id = createId();
  await createEvent({
    id,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || "",
    content: (formData.get("content") as string) || "",
    cover_image: (formData.get("cover_image") as string) || "",
    location: (formData.get("location") as string) || "",
    external_url: (formData.get("external_url") as string) || "",
    is_published: formData.get("is_published") === "on" ? true : false,
    market_id: (formData.get("market_id") as string) || "cn",
  });
  await setEventTags(id, parseTagIds(formData));
  revalidateAll();
}

export async function updateEventAction(id: string, formData: FormData) {
  await updateEvent(id, {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || "",
    content: (formData.get("content") as string) || "",
    cover_image: (formData.get("cover_image") as string) || "",
    location: (formData.get("location") as string) || "",
    external_url: (formData.get("external_url") as string) || "",
    is_published: formData.get("is_published") === "on" ? true : false,
  });
  await setEventTags(id, parseTagIds(formData));
  revalidateAll();
}

export async function deleteEventAction(id: string) {
  await deleteEvent(id);
  revalidateAll();
}
