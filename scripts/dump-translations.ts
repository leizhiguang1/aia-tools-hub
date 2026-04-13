import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data } = await s.from("translations").select("*");
  writeFileSync("scripts/translations-snapshot.json", JSON.stringify(data, null, 2));
  console.log("rows:", data?.length);
}
main();
