import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const [categories, tools, tags, events, posts, translations] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("tools").select("*").order("sort_order"),
    supabase.from("tags").select("*").order("sort_order"),
    supabase.from("events").select("*"),
    supabase.from("posts").select("*"),
    supabase.from("translations").select("entity_type, entity_id, locale, field"),
  ]);

  const summary = {
    categories: categories.data ?? [],
    tools: tools.data ?? [],
    tags: tags.data ?? [],
    events: events.data ?? [],
    posts: posts.data ?? [],
    existingTranslations: translations.data ?? [],
  };

  writeFileSync(
    "scripts/db-snapshot.json",
    JSON.stringify(summary, null, 2)
  );

  console.log("Counts:");
  console.log("  categories:", summary.categories.length);
  console.log("  tools:", summary.tools.length);
  console.log("  tags:", summary.tags.length);
  console.log("  events:", summary.events.length);
  console.log("  posts:", summary.posts.length);
  console.log("  existing translations:", summary.existingTranslations.length);
}

main();
