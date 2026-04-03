import { getCategories } from "@/db/queries";
import { AdminCategories } from "@/components/admin-categories";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return <AdminCategories categories={categories} />;
}
