"use server";

import { createId } from "@paralleldrive/cuid2";
import { createTool, updateTool, deleteTool, setToolTags } from "@/db/queries";
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
  for (const locale of locales) revalidatePath(`/${locale}`);
  revalidatePath("/admin/[market]/tools", "page");
}

export async function createToolAction(formData: FormData) {
  const id = createId();
  await createTool({
    id,
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || "",
    url: formData.get("url") as string,
    icon: (formData.get("icon") as string) || "",
    category_id: formData.get("category_id") as string,
    pricing: (formData.get("pricing") as string) || "freemium",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_published: formData.get("is_published") === "on" ? true : false,
    market_id: (formData.get("market_id") as string) || "cn",
  });
  await setToolTags(id, parseTagIds(formData));
  revalidateAll();
}

export async function updateToolAction(id: string, formData: FormData) {
  await updateTool(id, {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || "",
    url: formData.get("url") as string,
    icon: (formData.get("icon") as string) || "",
    category_id: formData.get("category_id") as string,
    pricing: (formData.get("pricing") as string) || "freemium",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_published: formData.get("is_published") === "on" ? true : false,
  });
  await setToolTags(id, parseTagIds(formData));
  revalidateAll();
}

export async function deleteToolAction(id: string) {
  await deleteTool(id);
  revalidateAll();
}
