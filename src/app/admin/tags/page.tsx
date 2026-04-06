import { getTags, getTranslations } from "@/db/queries";
import { AdminTags } from "@/components/admin-tags";
import { defaultLocale } from "@/lib/i18n";

export default async function AdminTagsPage() {
  const tags = await getTags();

  const translationsRecord: Record<string, Record<string, Record<string, string>>> = {};
  for (const tag of tags) {
    const trans = await getTranslations("tag", tag.id);
    const byLocale: Record<string, Record<string, string>> = {};
    for (const t of trans) {
      if (t.locale === defaultLocale) continue;
      if (!byLocale[t.locale]) byLocale[t.locale] = {};
      byLocale[t.locale][t.field] = t.value;
    }
    if (Object.keys(byLocale).length > 0) {
      translationsRecord[tag.id] = byLocale;
    }
  }

  return <AdminTags tags={tags} translationsRecord={translationsRecord} />;
}
