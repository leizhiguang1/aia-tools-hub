"use server";

import { createId } from "@paralleldrive/cuid2";
import { createTag, updateTag, deleteTag } from "@/db/queries";
import { revalidatePath } from "next/cache";
import { locales } from "@/lib/i18n";

function revalidateAll() {
  for (const locale of locales) revalidatePath(`/${locale}`);
  revalidatePath("/admin/[market]/tags", "page");
}

export async function createTagAction(formData: FormData) {
  await createTag({
    id: createId(),
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    color: (formData.get("color") as string) || "",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    market_id: (formData.get("market_id") as string) || "cn",
  });
  revalidateAll();
}

/** Create a tag inline (from TagInput component) and return the created tag */
export async function createTagInlineAction(data: {
  name: string;
  color: string;
  market_id: string;
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
    market_id: data.market_id,
  });
  revalidateAll();
  return { id, name: data.name, slug, color: data.color, sort_order: 0, market_id: data.market_id, created_at: new Date().toISOString() };
}

export async function updateTagAction(id: string, formData: FormData) {
  await updateTag(id, {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    color: (formData.get("color") as string) || "",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  });
  revalidateAll();
}

export async function deleteTagAction(id: string) {
  await deleteTag(id);
  revalidateAll();
}
