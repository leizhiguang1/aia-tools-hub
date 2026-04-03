import type { Row } from "@libsql/client";
import { db } from "./client";
import type { Category, Tool, Event, Post, Admin, Tag } from "@/types";

/** Convert libsql Row objects to plain objects so they can be passed to Client Components */
function plainRows<T>(rows: Row[]): T[] {
  return rows.map((row) => ({ ...row }) as T);
}

function plainRow<T>(row: Row | undefined): T | null {
  return row ? ({ ...row } as T) : null;
}

// ============ Categories ============

export async function getCategories() {
  const result = await db.execute("SELECT * FROM categories ORDER BY sort_order ASC");
  return plainRows<Category>(result.rows);
}

export async function getCategoryById(id: string) {
  const result = await db.execute({ sql: "SELECT * FROM categories WHERE id = ?", args: [id] });
  return plainRow<Category>(result.rows[0]);
}

export async function createCategory(data: { id: string; name_zh: string; name_en: string; slug: string; sort_order: number }) {
  await db.execute({
    sql: "INSERT INTO categories (id, name_zh, name_en, slug, sort_order) VALUES (?, ?, ?, ?, ?)",
    args: [data.id, data.name_zh, data.name_en, data.slug, data.sort_order],
  });
}

export async function updateCategory(id: string, data: { name_zh: string; name_en: string; slug: string; sort_order: number }) {
  await db.execute({
    sql: "UPDATE categories SET name_zh = ?, name_en = ?, slug = ?, sort_order = ? WHERE id = ?",
    args: [data.name_zh, data.name_en, data.slug, data.sort_order, id],
  });
}

export async function deleteCategory(id: string) {
  await db.execute({ sql: "DELETE FROM categories WHERE id = ?", args: [id] });
}

// ============ Tools ============

export async function getTools(categorySlug?: string) {
  if (categorySlug && categorySlug !== "all") {
    const result = await db.execute({
      sql: `SELECT t.*, c.name_zh as category_name_zh, c.name_en as category_name_en, c.slug as category_slug
            FROM tools t JOIN categories c ON t.category_id = c.id
            WHERE c.slug = ? AND t.is_published = 1
            ORDER BY t.sort_order ASC`,
      args: [categorySlug],
    });
    return plainRows<Tool>(result.rows);
  }
  const result = await db.execute(
    `SELECT t.*, c.name_zh as category_name_zh, c.name_en as category_name_en, c.slug as category_slug
     FROM tools t JOIN categories c ON t.category_id = c.id
     WHERE t.is_published = 1
     ORDER BY c.sort_order ASC, t.sort_order ASC`
  );
  return plainRows<Tool>(result.rows);
}

export async function getAllTools() {
  const result = await db.execute(
    `SELECT t.*, c.name_zh as category_name_zh, c.slug as category_slug
     FROM tools t JOIN categories c ON t.category_id = c.id
     ORDER BY c.sort_order ASC, t.sort_order ASC`
  );
  return plainRows<Tool>(result.rows);
}

export async function getToolById(id: string) {
  const result = await db.execute({ sql: "SELECT * FROM tools WHERE id = ?", args: [id] });
  return plainRow<Tool>(result.rows[0]);
}

export async function createTool(data: {
  id: string; name: string; description_zh: string; description_en: string;
  url: string; icon: string; category_id: string;
  sort_order: number; is_published: number;
}) {
  await db.execute({
    sql: `INSERT INTO tools (id, name, description_zh, description_en, url, icon, category_id, sort_order, is_published)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [data.id, data.name, data.description_zh, data.description_en, data.url, data.icon, data.category_id, data.sort_order, data.is_published],
  });
}

export async function updateTool(id: string, data: {
  name: string; description_zh: string; description_en: string;
  url: string; icon: string; category_id: string;
  sort_order: number; is_published: number;
}) {
  await db.execute({
    sql: `UPDATE tools SET name = ?, description_zh = ?, description_en = ?, url = ?, icon = ?, category_id = ?, sort_order = ?, is_published = ?, updated_at = unixepoch() WHERE id = ?`,
    args: [data.name, data.description_zh, data.description_en, data.url, data.icon, data.category_id, data.sort_order, data.is_published, id],
  });
}

export async function deleteTool(id: string) {
  await db.execute({ sql: "DELETE FROM tools WHERE id = ?", args: [id] });
}

// ============ Events ============

export async function getEvents(status?: string) {
  const now = new Date().toISOString().split("T")[0];
  let sql = `SELECT * FROM events WHERE is_published = 1`;
  const args: string[] = [];

  if (status === "upcoming") {
    sql += ` AND date_start > ?`;
    args.push(now);
  } else if (status === "past") {
    sql += ` AND (date_end < ? OR (date_end IS NULL AND date_start < ?))`;
    args.push(now, now);
  }

  sql += ` ORDER BY date_start DESC`;
  const result = await db.execute({ sql, args });
  return plainRows<Event>(result.rows);
}

export async function getAllEvents() {
  const result = await db.execute("SELECT * FROM events ORDER BY date_start DESC");
  return plainRows<Event>(result.rows);
}

export async function getEventById(id: string) {
  const result = await db.execute({ sql: "SELECT * FROM events WHERE id = ?", args: [id] });
  return plainRow<Event>(result.rows[0]);
}

export async function createEvent(data: {
  id: string; title_zh: string; title_en: string; description_zh: string; description_en: string;
  content_zh: string; content_en: string; cover_image: string; date_start: string; date_end: string;
  location: string; external_url: string; is_published: number;
}) {
  await db.execute({
    sql: `INSERT INTO events (id, title_zh, title_en, description_zh, description_en, content_zh, content_en, cover_image, date_start, date_end, location, external_url, is_published)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [data.id, data.title_zh, data.title_en, data.description_zh, data.description_en, data.content_zh, data.content_en, data.cover_image, data.date_start, data.date_end, data.location, data.external_url, data.is_published],
  });
}

export async function updateEvent(id: string, data: {
  title_zh: string; title_en: string; description_zh: string; description_en: string;
  content_zh: string; content_en: string; cover_image: string; date_start: string; date_end: string;
  location: string; external_url: string; is_published: number;
}) {
  await db.execute({
    sql: `UPDATE events SET title_zh = ?, title_en = ?, description_zh = ?, description_en = ?, content_zh = ?, content_en = ?, cover_image = ?, date_start = ?, date_end = ?, location = ?, external_url = ?, is_published = ?, updated_at = unixepoch() WHERE id = ?`,
    args: [data.title_zh, data.title_en, data.description_zh, data.description_en, data.content_zh, data.content_en, data.cover_image, data.date_start, data.date_end, data.location, data.external_url, data.is_published, id],
  });
}

export async function deleteEvent(id: string) {
  await db.execute({ sql: "DELETE FROM events WHERE id = ?", args: [id] });
}

// ============ Posts ============

export async function getPosts(page = 1, perPage = 10) {
  const offset = (page - 1) * perPage;
  const result = await db.execute({
    sql: "SELECT * FROM posts WHERE is_published = 1 ORDER BY published_at DESC LIMIT ? OFFSET ?",
    args: [perPage, offset],
  });
  const countResult = await db.execute("SELECT COUNT(*) as count FROM posts WHERE is_published = 1");
  const total = Number(countResult.rows[0].count);
  return { posts: plainRows<Post>(result.rows), total, totalPages: Math.ceil(total / perPage) };
}

export async function getAllPosts() {
  const result = await db.execute("SELECT * FROM posts ORDER BY created_at DESC");
  return plainRows<Post>(result.rows);
}

export async function getPostBySlug(slug: string) {
  const result = await db.execute({ sql: "SELECT * FROM posts WHERE slug = ? AND is_published = 1", args: [slug] });
  return plainRow<Post>(result.rows[0]);
}

export async function getPostById(id: string) {
  const result = await db.execute({ sql: "SELECT * FROM posts WHERE id = ?", args: [id] });
  return plainRow<Post>(result.rows[0]);
}

export async function createPost(data: {
  id: string; title_zh: string; title_en: string; slug: string; content_zh: string; content_en: string;
  excerpt_zh: string; excerpt_en: string; cover_image: string; author: string; is_published: number;
}) {
  await db.execute({
    sql: `INSERT INTO posts (id, title_zh, title_en, slug, content_zh, content_en, excerpt_zh, excerpt_en, cover_image, author, is_published)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [data.id, data.title_zh, data.title_en, data.slug, data.content_zh, data.content_en, data.excerpt_zh, data.excerpt_en, data.cover_image, data.author, data.is_published],
  });
}

export async function updatePost(id: string, data: {
  title_zh: string; title_en: string; slug: string; content_zh: string; content_en: string;
  excerpt_zh: string; excerpt_en: string; cover_image: string; author: string; is_published: number;
}) {
  await db.execute({
    sql: `UPDATE posts SET title_zh = ?, title_en = ?, slug = ?, content_zh = ?, content_en = ?, excerpt_zh = ?, excerpt_en = ?, cover_image = ?, author = ?, is_published = ?, updated_at = unixepoch() WHERE id = ?`,
    args: [data.title_zh, data.title_en, data.slug, data.content_zh, data.content_en, data.excerpt_zh, data.excerpt_en, data.cover_image, data.author, data.is_published, id],
  });
}

export async function deletePost(id: string) {
  await db.execute({ sql: "DELETE FROM posts WHERE id = ?", args: [id] });
}

// ============ Tags ============

export async function getTags() {
  const result = await db.execute("SELECT * FROM tags ORDER BY sort_order ASC, name_zh ASC");
  return plainRows<Tag>(result.rows);
}

export async function getTagById(id: string) {
  const result = await db.execute({ sql: "SELECT * FROM tags WHERE id = ?", args: [id] });
  return plainRow<Tag>(result.rows[0]);
}

export async function createTag(data: { id: string; name_zh: string; name_en: string; slug: string; color: string; sort_order: number }) {
  await db.execute({
    sql: "INSERT INTO tags (id, name_zh, name_en, slug, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
    args: [data.id, data.name_zh, data.name_en, data.slug, data.color, data.sort_order],
  });
}

export async function updateTag(id: string, data: { name_zh: string; name_en: string; slug: string; color: string; sort_order: number }) {
  await db.execute({
    sql: "UPDATE tags SET name_zh = ?, name_en = ?, slug = ?, color = ?, sort_order = ? WHERE id = ?",
    args: [data.name_zh, data.name_en, data.slug, data.color, data.sort_order, id],
  });
}

export async function deleteTag(id: string) {
  await db.execute({ sql: "DELETE FROM tags WHERE id = ?", args: [id] });
}

// ---- Bulk tag fetching (avoids N+1) ----

export async function getTagsForTools(toolIds: string[]): Promise<Map<string, Tag[]>> {
  if (toolIds.length === 0) return new Map();
  const placeholders = toolIds.map(() => "?").join(",");
  const result = await db.execute({
    sql: `SELECT tt.tool_id, t.* FROM tags t JOIN tool_tags tt ON t.id = tt.tag_id WHERE tt.tool_id IN (${placeholders}) ORDER BY t.sort_order ASC`,
    args: toolIds,
  });
  const map = new Map<string, Tag[]>();
  for (const row of result.rows) {
    const toolId = row.tool_id as string;
    if (!map.has(toolId)) map.set(toolId, []);
    map.get(toolId)!.push({ ...row } as unknown as Tag);
  }
  return map;
}

export async function getTagsForEvents(eventIds: string[]): Promise<Map<string, Tag[]>> {
  if (eventIds.length === 0) return new Map();
  const placeholders = eventIds.map(() => "?").join(",");
  const result = await db.execute({
    sql: `SELECT et.event_id, t.* FROM tags t JOIN event_tags et ON t.id = et.tag_id WHERE et.event_id IN (${placeholders}) ORDER BY t.sort_order ASC`,
    args: eventIds,
  });
  const map = new Map<string, Tag[]>();
  for (const row of result.rows) {
    const eventId = row.event_id as string;
    if (!map.has(eventId)) map.set(eventId, []);
    map.get(eventId)!.push({ ...row } as unknown as Tag);
  }
  return map;
}

export async function getTagsForPosts(postIds: string[]): Promise<Map<string, Tag[]>> {
  if (postIds.length === 0) return new Map();
  const placeholders = postIds.map(() => "?").join(",");
  const result = await db.execute({
    sql: `SELECT pt.post_id, t.* FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id IN (${placeholders}) ORDER BY t.sort_order ASC`,
    args: postIds,
  });
  const map = new Map<string, Tag[]>();
  for (const row of result.rows) {
    const postId = row.post_id as string;
    if (!map.has(postId)) map.set(postId, []);
    map.get(postId)!.push({ ...row } as unknown as Tag);
  }
  return map;
}

// ---- Tag associations ----

export async function getTagsForTool(toolId: string) {
  const result = await db.execute({
    sql: "SELECT t.* FROM tags t JOIN tool_tags tt ON t.id = tt.tag_id WHERE tt.tool_id = ? ORDER BY t.sort_order ASC",
    args: [toolId],
  });
  return plainRows<Tag>(result.rows);
}

export async function getTagsForEvent(eventId: string) {
  const result = await db.execute({
    sql: "SELECT t.* FROM tags t JOIN event_tags et ON t.id = et.tag_id WHERE et.event_id = ? ORDER BY t.sort_order ASC",
    args: [eventId],
  });
  return plainRows<Tag>(result.rows);
}

export async function getTagsForPost(postId: string) {
  const result = await db.execute({
    sql: "SELECT t.* FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = ? ORDER BY t.sort_order ASC",
    args: [postId],
  });
  return plainRows<Tag>(result.rows);
}

export async function setToolTags(toolId: string, tagIds: string[]) {
  await db.execute({ sql: "DELETE FROM tool_tags WHERE tool_id = ?", args: [toolId] });
  for (const tagId of tagIds) {
    await db.execute({ sql: "INSERT INTO tool_tags (tool_id, tag_id) VALUES (?, ?)", args: [toolId, tagId] });
  }
}

export async function setEventTags(eventId: string, tagIds: string[]) {
  await db.execute({ sql: "DELETE FROM event_tags WHERE event_id = ?", args: [eventId] });
  for (const tagId of tagIds) {
    await db.execute({ sql: "INSERT INTO event_tags (event_id, tag_id) VALUES (?, ?)", args: [eventId, tagId] });
  }
}

export async function setPostTags(postId: string, tagIds: string[]) {
  await db.execute({ sql: "DELETE FROM post_tags WHERE post_id = ?", args: [postId] });
  for (const tagId of tagIds) {
    await db.execute({ sql: "INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)", args: [postId, tagId] });
  }
}

// ============ Admins ============

export async function getAdminByEmail(email: string) {
  const result = await db.execute({ sql: "SELECT * FROM admins WHERE email = ?", args: [email] });
  return plainRow<Admin>(result.rows[0]);
}
