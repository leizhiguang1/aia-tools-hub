import { supabase } from "./client";
import type { Category, Tool, Event, Post, Tag, Translation } from "@/types";

// ============ Categories ============

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as Category[];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Category | null;
}

export async function createCategory(data: { id: string; name: string; slug: string; sort_order: number }) {
  const { error } = await supabase.from("categories").insert(data);
  if (error) throw error;
}

export async function updateCategory(id: string, data: { name: string; slug: string; sort_order: number }) {
  const { error } = await supabase.from("categories").update(data).eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ============ Tools ============

export async function getTools(categorySlug?: string): Promise<Tool[]> {
  if (categorySlug && categorySlug !== "all") {
    const { data, error } = await supabase
      .from("tools")
      .select("*, categories!inner(name, slug, sort_order)")
      .eq("is_published", true)
      .eq("categories.slug", categorySlug)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return flattenToolCategories(data);
  }

  const { data, error } = await supabase
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

export async function getAllTools(): Promise<Tool[]> {
  const { data, error } = await supabase
    .from("tools")
    .select("*, categories!inner(name, slug, sort_order)")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  const tools = flattenToolCategories(data);
  tools.sort((a, b) => {
    const catDiff = (a._cat_sort ?? 0) - (b._cat_sort ?? 0);
    return catDiff !== 0 ? catDiff : a.sort_order - b.sort_order;
  });
  return tools;
}

export async function getToolById(id: string): Promise<Tool | null> {
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Tool | null;
}

export async function createTool(data: {
  id: string; name: string; description: string;
  url: string; icon: string; category_id: string; pricing: string;
  sort_order: number; is_published: boolean;
}) {
  const { error } = await supabase.from("tools").insert(data);
  if (error) throw error;
}

export async function updateTool(id: string, data: {
  name: string; description: string;
  url: string; icon: string; category_id: string; pricing: string;
  sort_order: number; is_published: boolean;
}) {
  const { error } = await supabase.from("tools").update(data).eq("id", id);
  if (error) throw error;
}

export async function getToolsByIds(ids: string[]): Promise<Tool[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("tools")
    .select("*, categories!inner(name, slug, sort_order)")
    .in("id", ids)
    .eq("is_published", true);
  if (error) throw error;
  const tools = flattenToolCategories(data);
  tools.sort((a, b) => {
    const catDiff = (a._cat_sort ?? 0) - (b._cat_sort ?? 0);
    return catDiff !== 0 ? catDiff : a.sort_order - b.sort_order;
  });
  return tools;
}

export async function deleteTool(id: string) {
  const { error } = await supabase.from("tools").delete().eq("id", id);
  if (error) throw error;
}

export async function getPopularTools(limit = 5): Promise<{ tools: Tool[]; totalVotes: number }> {
  const [{ data, error }, { count, error: countError }] = await Promise.all([
    supabase
      .from("tools")
      .select("*, categories!inner(name, slug, sort_order)")
      .eq("is_published", true)
      .gt("vote_count", 0)
      .order("vote_count", { ascending: false })
      .order("name", { ascending: true })
      .limit(limit),
    supabase
      .from("votes")
      .select("*", { count: "exact", head: true }),
  ]);
  if (error) throw error;
  if (countError) throw countError;
  return { tools: flattenToolCategories(data), totalVotes: count ?? 0 };
}

export async function recordVote(id: string, toolId: string, voterHash: string): Promise<boolean> {
  const { error: insertError } = await supabase
    .from("votes")
    .insert({ id, tool_id: toolId, voter_hash: voterHash });

  if (insertError) {
    if (insertError.code === "23505") return false;
    throw insertError;
  }

  const { error: updateError } = await supabase.rpc("increment_vote_count", { tool_id_param: toolId });
  if (updateError) {
    const { data: tool } = await supabase.from("tools").select("vote_count").eq("id", toolId).single();
    if (tool) {
      await supabase.from("tools").update({ vote_count: (tool.vote_count ?? 0) + 1 }).eq("id", toolId);
    }
  }
  return true;
}

export async function getToolVoteCount(toolId: string): Promise<number> {
  const { data, error } = await supabase
    .from("tools")
    .select("vote_count")
    .eq("id", toolId)
    .single();
  if (error) return 0;
  return data?.vote_count ?? 0;
}

// ============ Events ============

export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Event[];
}

export async function getAllEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Event[];
}

export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Event | null;
}

export async function createEvent(data: {
  id: string; title: string; description: string;
  content: string; cover_image: string;
  location: string; external_url: string; is_published: boolean;
}) {
  const { error } = await supabase.from("events").insert({ ...data, date_start: "", date_end: "" });
  if (error) throw error;
}

export async function updateEvent(id: string, data: {
  title: string; description: string;
  content: string; cover_image: string;
  location: string; external_url: string; is_published: boolean;
}) {
  const { error } = await supabase.from("events").update(data).eq("id", id);
  if (error) throw error;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}

// ============ Posts ============

export async function getPosts(page = 1, perPage = 10) {
  const offset = (page - 1) * perPage;

  const { data, error, count } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .range(offset, offset + perPage - 1);
  if (error) throw error;
  const total = count ?? 0;
  return { posts: data as Post[], total, totalPages: Math.ceil(total / perPage) };
}

export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  return data as Post | null;
}

export async function getPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Post | null;
}

export async function createPost(data: {
  id: string; title: string; slug: string; content: string;
  excerpt: string; cover_image: string; author: string; is_published: boolean;
}) {
  const { error } = await supabase.from("posts").insert(data);
  if (error) throw error;
}

export async function updatePost(id: string, data: {
  title: string; slug: string; content: string;
  excerpt: string; cover_image: string; author: string; is_published: boolean;
}) {
  const { error } = await supabase.from("posts").update(data).eq("id", id);
  if (error) throw error;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

// ============ Tags ============

export async function getTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return data as Tag[];
}

export async function getTagById(id: string): Promise<Tag | null> {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Tag | null;
}

export async function createTag(data: { id: string; name: string; slug: string; color: string; sort_order: number }) {
  const { error } = await supabase.from("tags").insert(data);
  if (error) throw error;
}

export async function updateTag(id: string, data: { name: string; slug: string; color: string; sort_order: number }) {
  const { error } = await supabase.from("tags").update(data).eq("id", id);
  if (error) throw error;
}

export async function deleteTag(id: string) {
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) throw error;
}

// ---- Bulk tag fetching (avoids N+1) ----

export async function getTagsForTools(toolIds: string[]): Promise<Map<string, Tag[]>> {
  if (toolIds.length === 0) return new Map();
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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

// ---- Tag associations ----

export async function getTagsForTool(toolId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("tool_tags")
    .select("tags(*)")
    .eq("tool_id", toolId);
  if (error) throw error;
  return (data ?? []).map((row) => row.tags as unknown as Tag).filter(Boolean);
}

export async function getTagsForEvent(eventId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("event_tags")
    .select("tags(*)")
    .eq("event_id", eventId);
  if (error) throw error;
  return (data ?? []).map((row) => row.tags as unknown as Tag).filter(Boolean);
}

export async function getTagsForPost(postId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("post_tags")
    .select("tags(*)")
    .eq("post_id", postId);
  if (error) throw error;
  return (data ?? []).map((row) => row.tags as unknown as Tag).filter(Boolean);
}

export async function setToolTags(toolId: string, tagIds: string[]) {
  await supabase.from("tool_tags").delete().eq("tool_id", toolId);
  if (tagIds.length > 0) {
    const { error } = await supabase
      .from("tool_tags")
      .insert(tagIds.map((tagId) => ({ tool_id: toolId, tag_id: tagId })));
    if (error) throw error;
  }
}

export async function setEventTags(eventId: string, tagIds: string[]) {
  await supabase.from("event_tags").delete().eq("event_id", eventId);
  if (tagIds.length > 0) {
    const { error } = await supabase
      .from("event_tags")
      .insert(tagIds.map((tagId) => ({ event_id: eventId, tag_id: tagId })));
    if (error) throw error;
  }
}

export async function setPostTags(postId: string, tagIds: string[]) {
  await supabase.from("post_tags").delete().eq("post_id", postId);
  if (tagIds.length > 0) {
    const { error } = await supabase
      .from("post_tags")
      .insert(tagIds.map((tagId) => ({ post_id: postId, tag_id: tagId })));
    if (error) throw error;
  }
}

// ============ Translations ============

export async function getTranslations(
  entityType: string,
  entityId: string
): Promise<Translation[]> {
  const { data, error } = await supabase
    .from("translations")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId);
  if (error) {
    if (error.code === "PGRST205") return []; // table not created yet
    throw error;
  }
  return data as Translation[];
}

export async function getTranslationsForLocale(
  entityType: string,
  entityId: string,
  locale: string
): Promise<Record<string, string>> {
  if (locale === "zh-MY") return {};
  const { data, error } = await supabase
    .from("translations")
    .select("field, value")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .eq("locale", locale);
  if (error) {
    if (error.code === "PGRST205") return {}; // table not created yet
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
  if (entityIds.length === 0 || locale === "zh-MY") return map;
  const { data, error } = await supabase
    .from("translations")
    .select("entity_id, field, value")
    .eq("entity_type", entityType)
    .eq("locale", locale)
    .in("entity_id", entityIds);
  if (error) {
    if (error.code === "PGRST205") return map; // table not created yet
    throw error;
  }
  for (const row of data ?? []) {
    if (!map.has(row.entity_id)) map.set(row.entity_id, {});
    map.get(row.entity_id)![row.field] = row.value;
  }
  return map;
}

export async function upsertTranslation(data: {
  entity_type: string;
  entity_id: string;
  locale: string;
  field: string;
  value: string;
}) {
  const { error } = await supabase
    .from("translations")
    .upsert(
      { ...data, updated_at: new Date().toISOString() },
      { onConflict: "entity_type,entity_id,locale,field" }
    );
  if (error) throw error;
}

export async function deleteTranslationsForEntity(
  entityType: string,
  entityId: string
) {
  const { error } = await supabase
    .from("translations")
    .delete()
    .eq("entity_type", entityType)
    .eq("entity_id", entityId);
  if (error) throw error;
}

// ---- Helper ----

interface ToolWithCategory {
  categories: { name: string; slug: string; sort_order: number };
  [key: string]: unknown;
}

function flattenToolCategories(data: ToolWithCategory[]): (Tool & { _cat_sort?: number })[] {
  return (data ?? []).map(({ categories: cat, ...tool }) => ({
    ...tool,
    category_name: cat.name,
    category_slug: cat.slug,
    _cat_sort: cat.sort_order,
  })) as (Tool & { _cat_sort?: number })[];
}

// ============ Leads ============

export async function createLead(data: { id: string; email: string; whatsapp: string; locale: string }) {
  const { error } = await supabase.from("leads").insert(data);
  if (error) throw error;
}
