"use server";

import { createId } from "@paralleldrive/cuid2";
import { createCategory, updateCategory, deleteCategory } from "@/db/queries";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData) {
  await createCategory({
    id: createId(),
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  });
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await updateCategory(id, {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  });
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function deleteCategoryAction(id: string) {
  await deleteCategory(id);
  revalidatePath("/");
  revalidatePath("/admin/categories");
}
