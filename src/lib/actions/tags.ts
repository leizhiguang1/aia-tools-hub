"use server";

import { createId } from "@paralleldrive/cuid2";
import { createTag, updateTag, deleteTag } from "@/db/queries";
import { revalidatePath } from "next/cache";

export async function createTagAction(formData: FormData) {
  await createTag({
    id: createId(),
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    color: (formData.get("color") as string) || "",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  });
  revalidatePath("/");
  revalidatePath("/admin/tags");
}

/** Create a tag inline (from TagInput component) and return the created tag */
export async function createTagInlineAction(data: {
  name: string;
  color: string;
}) {
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "") || createId().slice(0, 8);
  const id = createId();
  await createTag({
    id,
    name: data.name,
    slug,
    color: data.color,
    sort_order: 0,
  });
  revalidatePath("/");
  revalidatePath("/admin/tags");
  return { id, name: data.name, slug, color: data.color, sort_order: 0, created_at: new Date().toISOString() };
}

export async function updateTagAction(id: string, formData: FormData) {
  await updateTag(id, {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    color: (formData.get("color") as string) || "",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  });
  revalidatePath("/");
  revalidatePath("/admin/tags");
}

export async function deleteTagAction(id: string) {
  await deleteTag(id);
  revalidatePath("/");
  revalidatePath("/admin/tags");
}
