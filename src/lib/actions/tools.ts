"use server";

import { createId } from "@paralleldrive/cuid2";
import { createTool, updateTool, deleteTool, setToolTags } from "@/db/queries";
import { revalidatePath } from "next/cache";

function parseTagIds(formData: FormData): string[] {
  try {
    return JSON.parse((formData.get("tag_ids") as string) || "[]");
  } catch {
    return [];
  }
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
  });
  await setToolTags(id, parseTagIds(formData));
  revalidatePath("/");
  revalidatePath("/admin/tools");
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
  revalidatePath("/");
  revalidatePath("/admin/tools");
}

export async function deleteToolAction(id: string) {
  await deleteTool(id);
  revalidatePath("/");
  revalidatePath("/admin/tools");
}
