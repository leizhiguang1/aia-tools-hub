import { getTags } from "@/db/queries";
import { AdminTags } from "@/components/admin-tags";

export default async function AdminTagsPage() {
  const tags = await getTags();
  return <AdminTags tags={tags} />;
}
