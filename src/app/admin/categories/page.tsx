import { getCategories, getTranslations } from "@/db/queries";
import { AdminCategories } from "@/components/admin-categories";
import { defaultLocale } from "@/lib/i18n";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  const translationsRecord: Record<string, Record<string, Record<string, string>>> = {};
  for (const cat of categories) {
    const trans = await getTranslations("category", cat.id);
    const byLocale: Record<string, Record<string, string>> = {};
    for (const t of trans) {
      if (t.locale === defaultLocale) continue;
      if (!byLocale[t.locale]) byLocale[t.locale] = {};
      byLocale[t.locale][t.field] = t.value;
    }
    if (Object.keys(byLocale).length > 0) {
      translationsRecord[cat.id] = byLocale;
    }
  }

  return <AdminCategories categories={categories} translationsRecord={translationsRecord} />;
}
