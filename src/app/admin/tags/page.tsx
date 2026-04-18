import { getTags, getBulkAllLocaleTranslations } from "@/db/queries";
import { AdminTags } from "@/features/admin/components/tags";

export default async function AdminTagsPage() {
  const tags = await getTags();
  const translationsRecord = await getBulkAllLocaleTranslations("tag", tags.map((t) => t.id));

  return <AdminTags tags={tags} translationsRecord={translationsRecord} />;
}
