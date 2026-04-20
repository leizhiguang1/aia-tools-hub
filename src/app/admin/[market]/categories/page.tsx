import { getCategories, getBulkAllLocaleTranslations } from "@/db/queries";
import { AdminCategories } from "@/features/admin/components/categories";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  const translationsRecord = await getBulkAllLocaleTranslations("category", categories.map((c) => c.id));

  return <AdminCategories categories={categories} translationsRecord={translationsRecord} />;
}
