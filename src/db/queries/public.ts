import { supabasePublic } from "../client";
import type { Category, Tool, Event, Post, Tag, Lead } from "@/types";

// ============ Categories ============

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabasePublic
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as Category[];
}

// ============ Tools ============

export async function getTools(categorySlug?: string): Promise<Tool[]> {
  if (categorySlug && categorySlug !== "all") {
    const { data, error } = await supabasePublic
      .from("tools")
      .select("*, categories!inner(name, slug, sort_order)")
      .eq("is_published", true)
      .eq("categories.slug", categorySlug)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return flattenToolCategories(data);
  }

  const { data, error } = await supabasePublic
    .from("tools")
    .select("*, categories!inner(name, slug, sort_order)")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  const tools = flattenToolCategories(data);
  tools.sort((a, b) => {
    const catDiff = (a._cat_sort ?? 0) - (b._cat_sort ?? 0);
    return catDiff !== 0 ? catDiff : a.sort_order - b.sort_order;
  });
  return tools;
}

export async function getPopularTools(limit = 5): Promise<{ tools: Tool[]; totalVotes: number }> {
  const [{ data, error }, { count, error: countError }] = await Promise.all([
    supabasePublic
      .from("tools")
      .select("*, categories!inner(name, slug, sort_order)")
      .eq("is_published", true)
      .gt("vote_count", 0)
      .order("vote_count", { ascending: false })
      .order("name", { ascending: true })
      .limit(limit),
    supabasePublic
      .from("votes")
      .select("*", { count: "exact", head: true }),
  ]);
  if (error) throw error;
  if (countError) throw countError;
  return { tools: flattenToolCategories(data), totalVotes: count ?? 0 };
}

export async function getToolVoteCount(toolId: string): Promise<number> {
  const { data, error } = await supabasePublic
    .from("tools")
    .select("vote_count")
    .eq("id", toolId)
    .single();
  if (error) return 0;
  return data?.vote_count ?? 0;
}

// ============ Events ============

export async function getEvents(marketId: string): Promise<Event[]> {
  const { data, error } = await supabasePublic
    .from("events")
    .select("*")
    .eq("is_published", true)
    .eq("market_id", marketId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Event[];
}

export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabasePublic
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Event | null;
}

// ============ Posts ============

export async function getPosts(marketId: string, page = 1, perPage = 10) {
  const offset = (page - 1) * perPage;

  const { data, error, count } = await supabasePublic
    .from("posts")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .eq("market_id", marketId)
    .order("published_at", { ascending: false })
    .range(offset, offset + perPage - 1);
  if (error) throw error;
  const total = count ?? 0;
  return { posts: data as Post[], total, totalPages: Math.ceil(total / perPage) };
}

export async function getPostBySlug(slug: string, marketId?: string): Promise<Post | null> {
  let query = supabasePublic
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true);
  if (marketId) query = query.eq("market_id", marketId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data as Post | null;
}

// ============ Tags ============

export async function getTags(): Promise<Tag[]> {
  const { data, error } = await supabasePublic
    .from("tags")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return data as Tag[];
}

// ---- Bulk tag fetching (avoids N+1) ----

export async function getTagsForTools(toolIds: string[]): Promise<Map<string, Tag[]>> {
  if (toolIds.length === 0) return new Map();
  const { data, error } = await supabasePublic
    .from("tool_tags")
    .select("tool_id, tags(*)")
    .in("tool_id", toolIds);
  if (error) throw error;

  const map = new Map<string, Tag[]>();
  for (const row of data ?? []) {
    const toolId = row.tool_id as string;
    if (!map.has(toolId)) map.set(toolId, []);
    if (row.tags) map.get(toolId)!.push(row.tags as unknown as Tag);
  }
  return map;
}

export async function getTagsForEvents(eventIds: string[]): Promise<Map<string, Tag[]>> {
  if (eventIds.length === 0) return new Map();
  const { data, error } = await supabasePublic
    .from("event_tags")
    .select("event_id, tags(*)")
    .in("event_id", eventIds);
  if (error) throw error;

  const map = new Map<string, Tag[]>();
  for (const row of data ?? []) {
    const eventId = row.event_id as string;
    if (!map.has(eventId)) map.set(eventId, []);
    if (row.tags) map.get(eventId)!.push(row.tags as unknown as Tag);
  }
  return map;
}

export async function getTagsForPosts(postIds: string[]): Promise<Map<string, Tag[]>> {
  if (postIds.length === 0) return new Map();
  const { data, error } = await supabasePublic
    .from("post_tags")
    .select("post_id, tags(*)")
    .in("post_id", postIds);
  if (error) throw error;

  const map = new Map<string, Tag[]>();
  for (const row of data ?? []) {
    const postId = row.post_id as string;
    if (!map.has(postId)) map.set(postId, []);
    if (row.tags) map.get(postId)!.push(row.tags as unknown as Tag);
  }
  return map;
}

export async function getTagsForEvent(eventId: string): Promise<Tag[]> {
  const { data, error } = await supabasePublic
    .from("event_tags")
    .select("tags(*)")
    .eq("event_id", eventId);
  if (error) throw error;
  return (data ?? []).map((row) => row.tags as unknown as Tag).filter(Boolean);
}

export async function getTagsForPost(postId: string): Promise<Tag[]> {
  const { data, error } = await supabasePublic
    .from("post_tags")
    .select("tags(*)")
    .eq("post_id", postId);
  if (error) throw error;
  return (data ?? []).map((row) => row.tags as unknown as Tag).filter(Boolean);
}

// ============ Translations ============

export async function getTranslationsForLocale(
  entityType: string,
  entityId: string,
  locale: string
): Promise<Record<string, string>> {
  if (locale === "cn") return {};
  const { data, error } = await supabasePublic
    .from("translations")
    .select("field, value")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .eq("locale", locale);
  if (error) {
    if (error.code === "PGRST205") return {};
    throw error;
  }
  return Object.fromEntries((data ?? []).map((r) => [r.field, r.value]));
}

export async function getBulkTranslations(
  entityType: string,
  entityIds: string[],
  locale: string
): Promise<Map<string, Record<string, string>>> {
  const map = new Map<string, Record<string, string>>();
  if (entityIds.length === 0 || locale === "cn") return map;
  const { data, error } = await supabasePublic
    .from("translations")
    .select("entity_id, field, value")
    .eq("entity_type", entityType)
    .eq("locale", locale)
    .in("entity_id", entityIds);
  if (error) {
    if (error.code === "PGRST205") return map;
    throw error;
  }
  for (const row of data ?? []) {
    if (!map.has(row.entity_id)) map.set(row.entity_id, {});
    map.get(row.entity_id)![row.field] = row.value;
  }
  return map;
}

// ============ Votes (writes — needs service role for insert) ============

import { supabaseAdmin } from "../client";

export async function recordVote(id: string, toolId: string, voterHash: string): Promise<boolean> {
  const { error: insertError } = await supabaseAdmin
    .from("votes")
    .insert({ id, tool_id: toolId, voter_hash: voterHash });

  if (insertError) {
    if (insertError.code === "23505") return false;
    throw insertError;
  }

  const { error: updateError } = await supabaseAdmin.rpc("increment_vote_count", { tool_id_param: toolId });
  if (updateError) {
    const { data: tool } = await supabaseAdmin.from("tools").select("vote_count").eq("id", toolId).single();
    if (tool) {
      await supabaseAdmin.from("tools").update({ vote_count: (tool.vote_count ?? 0) + 1 }).eq("id", toolId);
    }
  }
  return true;
}

// ============ Leads (write — needs service role) ============

export async function createLead(data: {
  id: string;
  email: string;
  whatsapp: string;
  locale: string;
  market_id: string;
  source: string;
}) {
  const { error } = await supabaseAdmin.from("leads").insert(data);
  if (error) throw error;
}

// ---- Helper ----

interface ToolWithCategory {
  categories: { name: string; slug: string; sort_order: number };
  [key: string]: unknown;
}

export function flattenToolCategories(data: ToolWithCategory[]): (Tool & { _cat_sort?: number })[] {
  return (data ?? []).map(({ categories: cat, ...tool }) => ({
    ...tool,
    category_name: cat.name,
    category_slug: cat.slug,
    _cat_sort: cat.sort_order,
  })) as (Tool & { _cat_sort?: number })[];
}
