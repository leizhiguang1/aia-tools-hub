"use server";

import { createId } from "@paralleldrive/cuid2";
import { createPost, updatePost, deletePost, setPostTags } from "@/db/queries";
import { revalidatePath } from "next/cache";

function parseTagIds(formData: FormData): string[] {
  try {
    return JSON.parse((formData.get("tag_ids") as string) || "[]");
  } catch {
    return [];
  }
}

export async function createPostAction(formData: FormData) {
  const id = createId();
  await createPost({
    id,
    title_zh: formData.get("title_zh") as string,
    title_en: (formData.get("title_en") as string) || "",
    slug: formData.get("slug") as string,
    content_zh: (formData.get("content_zh") as string) || "",
    content_en: (formData.get("content_en") as string) || "",
    excerpt_zh: (formData.get("excerpt_zh") as string) || "",
    excerpt_en: (formData.get("excerpt_en") as string) || "",
    cover_image: (formData.get("cover_image") as string) || "",
    author: (formData.get("author") as string) || "",

    is_published: formData.get("is_published") === "on" ? 1 : 0,
  });
  await setPostTags(id, parseTagIds(formData));
  revalidatePath("/news");
  revalidatePath("/admin/news");
}

export async function updatePostAction(id: string, formData: FormData) {
  await updatePost(id, {
    title_zh: formData.get("title_zh") as string,
    title_en: (formData.get("title_en") as string) || "",
    slug: formData.get("slug") as string,
    content_zh: (formData.get("content_zh") as string) || "",
    content_en: (formData.get("content_en") as string) || "",
    excerpt_zh: (formData.get("excerpt_zh") as string) || "",
    excerpt_en: (formData.get("excerpt_en") as string) || "",
    cover_image: (formData.get("cover_image") as string) || "",
    author: (formData.get("author") as string) || "",

    is_published: formData.get("is_published") === "on" ? 1 : 0,
  });
  await setPostTags(id, parseTagIds(formData));
  revalidatePath("/news");
  revalidatePath("/admin/news");
}

export async function deletePostAction(id: string) {
  await deletePost(id);
  revalidatePath("/news");
  revalidatePath("/admin/news");
}
