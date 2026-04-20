import { supabaseAdmin } from "../client";
import type { Category, Tool, Event, Post, Tag, Lead, Market } from "@/types";
import { flattenToolCategories } from "./public";

// ============ Categories ============

export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Category | null;
}

export async function createCategory(data: { id: string; name: string; slug: string; sort_order: number; market_id: string }) {
  const { error } = await supabaseAdmin.from("categories").insert(data);
  if (error) throw error;
}

export async function updateCategory(id: string, data: { name: string; slug: string; sort_order: number }) {
  const { error } = await supabaseAdmin.from("categories").update(data).eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ============ Tools ============

export async function getAllTools(marketId?: string): Promise<Tool[]> {
  let query = supabaseAdmin
    .from("tools")
    .select("*, categories!inner(name, slug, sort_order)")
    .order("sort_order", { ascending: true });
  if (marketId) query = query.eq("market_id", marketId);
  const { data, error } = await query;
  if (error) throw error;
  const tools = flattenToolCategories(data);
  tools.sort((a, b) => {
    const catDiff = (a._cat_sort ?? 0) - (b._cat_sort ?? 0);
    return catDiff !== 0 ? catDiff : a.sort_order - b.sort_order;
  });
  return tools;
}

export async function getToolById(id: string): Promise<Tool | null> {
  const { data, error } = await supabaseAdmin
    .from("tools")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Tool | null;
}

export async function getToolsByIds(ids: string[]): Promise<Tool[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabaseAdmin
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

export async function createTool(data: {
  id: string; name: string; description: string;
  url: string; icon: string; category_id: string; pricing: string;
  sort_order: number; is_published: boolean;
  market_id: string;
}) {
  const { error } = await supabaseAdmin.from("tools").insert(data);
  if (error) throw error;
}

export async function updateTool(id: string, data: {
  name: string; description: string;
  url: string; icon: string; category_id: string; pricing: string;
  sort_order: number; is_published: boolean;
}) {
  const { error } = await supabaseAdmin.from("tools").update(data).eq("id", id);
  if (error) throw error;
}

export async function deleteTool(id: string) {
  const { error } = await supabaseAdmin.from("tools").delete().eq("id", id);
  if (error) throw error;
}

// ============ Events ============

export async function getAllEvents(marketId?: string): Promise<Event[]> {
  let query = supabaseAdmin
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });
  if (marketId) query = query.eq("market_id", marketId);
  const { data, error } = await query;
  if (error) throw error;
  return data as Event[];
}

export async function createEvent(data: {
  id: string; title: string; description: string;
  content: string; cover_image: string;
  location: string; external_url: string; is_published: boolean;
  market_id: string;
}) {
  const { error } = await supabaseAdmin.from("events").insert({ ...data, date_start: "", date_end: "" });
  if (error) throw error;
}

export async function updateEvent(id: string, data: {
  title: string; description: string;
  content: string; cover_image: string;
  location: string; external_url: string; is_published: boolean;
}) {
  const { error } = await supabaseAdmin.from("events").update(data).eq("id", id);
  if (error) throw error;
}

export async function deleteEvent(id: string) {
  const { error } = await supabaseAdmin.from("events").delete().eq("id", id);
  if (error) throw error;
}

// ============ Posts ============

export async function getAllPosts(marketId?: string): Promise<Post[]> {
  let query = supabaseAdmin
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (marketId) query = query.eq("market_id", marketId);
  const { data, error } = await query;
  if (error) throw error;
  return data as Post[];
}

export async function getPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabaseAdmin
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
  market_id: string;
}) {
  const { error } = await supabaseAdmin.from("posts").insert(data);
  if (error) throw error;
}

export async function updatePost(id: string, data: {
  title: string; slug: string; content: string;
  excerpt: string; cover_image: string; author: string; is_published: boolean;
}) {
  const { error } = await supabaseAdmin.from("posts").update(data).eq("id", id);
  if (error) throw error;
}

export async function deletePost(id: string) {
  const { error } = await supabaseAdmin.from("posts").delete().eq("id", id);
  if (error) throw error;
}

// ============ Tags ============

export async function getTagById(id: string): Promise<Tag | null> {
  const { data, error } = await supabaseAdmin
    .from("tags")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Tag | null;
}

export async function createTag(data: { id: string; name: string; slug: string; color: string; sort_order: number; market_id: string }) {
  const { error } = await supabaseAdmin.from("tags").insert(data);
  if (error) throw error;
}

export async function updateTag(id: string, data: { name: string; slug: string; color: string; sort_order: number }) {
  const { error } = await supabaseAdmin.from("tags").update(data).eq("id", id);
  if (error) throw error;
}

export async function deleteTag(id: string) {
  const { error } = await supabaseAdmin.from("tags").delete().eq("id", id);
  if (error) throw error;
}

// ---- Tag associations ----

export async function getTagsForTool(toolId: string): Promise<Tag[]> {
  const { data, error } = await supabaseAdmin
    .from("tool_tags")
    .select("tags(*)")
    .eq("tool_id", toolId);
  if (error) throw error;
  return (data ?? []).map((row) => row.tags as unknown as Tag).filter(Boolean);
}

export async function setToolTags(toolId: string, tagIds: string[]) {
  await supabaseAdmin.from("tool_tags").delete().eq("tool_id", toolId);
  if (tagIds.length > 0) {
    const { error } = await supabaseAdmin
      .from("tool_tags")
      .insert(tagIds.map((tagId) => ({ tool_id: toolId, tag_id: tagId })));
    if (error) throw error;
  }
}

export async function setEventTags(eventId: string, tagIds: string[]) {
  await supabaseAdmin.from("event_tags").delete().eq("event_id", eventId);
  if (tagIds.length > 0) {
    const { error } = await supabaseAdmin
      .from("event_tags")
      .insert(tagIds.map((tagId) => ({ event_id: eventId, tag_id: tagId })));
    if (error) throw error;
  }
}

export async function setPostTags(postId: string, tagIds: string[]) {
  await supabaseAdmin.from("post_tags").delete().eq("post_id", postId);
  if (tagIds.length > 0) {
    const { error } = await supabaseAdmin
      .from("post_tags")
      .insert(tagIds.map((tagId) => ({ post_id: postId, tag_id: tagId })));
    if (error) throw error;
  }
}

// ============ Leads ============

export async function getAllLeads(marketId?: string): Promise<Lead[]> {
  let query = supabaseAdmin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (marketId) query = query.eq("market_id", marketId);
  const { data, error } = await query;
  if (error) throw error;
  return data as Lead[];
}

// ============ Markets ============

export async function getMarketById(id: string): Promise<Market | null> {
  const { data, error } = await supabaseAdmin
    .from("markets")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Market | null;
}

export async function updateMarket(id: string, data: { cta_url: string; qr_data_url: string }) {
  const { error } = await supabaseAdmin.from("markets").update(data).eq("id", id);
  if (error) throw error;
}
