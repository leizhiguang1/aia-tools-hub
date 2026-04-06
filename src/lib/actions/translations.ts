"use server";

import { upsertTranslation } from "@/db/queries";
import { locales, defaultLocale } from "@/lib/i18n";
import { revalidatePath } from "next/cache";

const TRANSLATABLE_FIELDS: Record<string, string[]> = {
  tool: ["name", "description"],
  event: ["title", "description", "content"],
  post: ["title", "content", "excerpt"],
  category: ["name"],
  tag: ["name"],
};

export async function saveTranslationsAction(
  entityType: string,
  entityId: string,
  formData: FormData
) {
  const fields = TRANSLATABLE_FIELDS[entityType] || [];

  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    for (const field of fields) {
      const value = formData.get(`${locale}.${field}`) as string;
      if (value !== null && value !== undefined) {
        await upsertTranslation({
          entity_type: entityType,
          entity_id: entityId,
          locale,
          field,
          value: value || "",
        });
      }
    }
  }

  // Revalidate all locale paths
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
  }
}
