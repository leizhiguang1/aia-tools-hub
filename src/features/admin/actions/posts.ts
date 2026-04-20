"use server";

import { createId } from "@paralleldrive/cuid2";
import { createPost, updatePost, deletePost, setPostTags } from "@/db/queries";
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
  for (const locale of locales) revalidatePath(`/${locale}/news`);
  revalidatePath("/admin/[market]/news", "page");
}

export async function createPostAction(formData: FormData) {
  const id = createId();
  await createPost({
    id,
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    content: (formData.get("content") as string) || "",
    excerpt: (formData.get("excerpt") as string) || "",
    cover_image: (formData.get("cover_image") as string) || "",
    author: (formData.get("author") as string) || "",
    is_published: formData.get("is_published") === "on" ? true : false,
    market_id: (formData.get("market_id") as string) || "cn",
  });
  await setPostTags(id, parseTagIds(formData));
  revalidateAll();
}

export async function updatePostAction(id: string, formData: FormData) {
  await updatePost(id, {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    content: (formData.get("content") as string) || "",
    excerpt: (formData.get("excerpt") as string) || "",
    cover_image: (formData.get("cover_image") as string) || "",
    author: (formData.get("author") as string) || "",
    is_published: formData.get("is_published") === "on" ? true : false,
  });
  await setPostTags(id, parseTagIds(formData));
  revalidateAll();
}

export async function deletePostAction(id: string) {
  await deletePost(id);
  revalidateAll();
}
