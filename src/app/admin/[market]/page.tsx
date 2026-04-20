import { redirect } from "next/navigation";

export default async function AdminMarketIndex({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  redirect(`/admin/${market}/tools`);
}
