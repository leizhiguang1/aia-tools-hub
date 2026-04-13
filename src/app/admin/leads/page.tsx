import { getAllLeads } from "@/db/queries";
import { AdminLeads } from "@/components/admin-leads";

export default async function AdminLeadsPage() {
  const leads = await getAllLeads();
  return <AdminLeads leads={leads} />;
}
