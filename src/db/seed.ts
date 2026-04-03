import { createClient } from "@libsql/client";
import { createId } from "@paralleldrive/cuid2";
import { hashSync } from "bcryptjs";

async function seed() {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    console.error("TURSO_DATABASE_URL is not set");
    process.exit(1);
  }

  const db = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log("Seeding database...");

  // ---- Admin ----
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminId = createId();
  await db.execute({
    sql: "INSERT OR IGNORE INTO admins (id, email, password_hash) VALUES (?, ?, ?)",
    args: [adminId, adminEmail, hashSync(adminPassword, 10)],
  });
  console.log(`✓ Admin created: ${adminEmail}`);

  // ---- Categories ----
  const categories = [
    { id: createId(), name_zh: "日常基建与模型", name_en: "Daily AI Models", slug: "models", sort_order: 1 },
    { id: createId(), name_zh: "视觉与内容创作", name_en: "Visual & Content Creation", slug: "visual", sort_order: 2 },
    { id: createId(), name_zh: "学习与效率神器", name_en: "Learning & Productivity", slug: "productivity", sort_order: 3 },
    { id: createId(), name_zh: "构建开发与自动化", name_en: "Dev & Automation", slug: "dev", sort_order: 4 },
  ];

  for (const c of categories) {
    await db.execute({
      sql: "INSERT OR IGNORE INTO categories (id, name_zh, name_en, slug, sort_order) VALUES (?, ?, ?, ?, ?)",
      args: [c.id, c.name_zh, c.name_en, c.slug, c.sort_order],
    });
  }
  console.log("✓ Categories seeded");

  // ---- Tags ----
  const tags = [
    { id: createId(), name_zh: "主要用", name_en: "Primary", slug: "primary", color: "#6366f1", sort_order: 1 },
    { id: createId(), name_zh: "搜索", name_en: "Search", slug: "search", color: "#f59e0b", sort_order: 2 },
    { id: createId(), name_zh: "笔记", name_en: "Notes", slug: "notes", color: "#10b981", sort_order: 3 },
    { id: createId(), name_zh: "项目管理", name_en: "PM", slug: "pm", color: "#3b82f6", sort_order: 4 },
    { id: createId(), name_zh: "Workshop", name_en: "Workshop", slug: "workshop", color: "#8b5cf6", sort_order: 5 },
    { id: createId(), name_zh: "免费", name_en: "Free", slug: "free", color: "#22c55e", sort_order: 6 },
    { id: createId(), name_zh: "线上活动", name_en: "Meetup", slug: "meetup", color: "#ec4899", sort_order: 7 },
    { id: createId(), name_zh: "AI", name_en: "AI", slug: "ai", color: "#0ea5e9", sort_order: 8 },
    { id: createId(), name_zh: "Vibecoding", name_en: "Vibecoding", slug: "vibecoding", color: "#f97316", sort_order: 9 },
    { id: createId(), name_zh: "工具", name_en: "Tools", slug: "tools", color: "#64748b", sort_order: 10 },
  ];

  for (const tag of tags) {
    await db.execute({
      sql: "INSERT OR IGNORE INTO tags (id, name_zh, name_en, slug, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
      args: [tag.id, tag.name_zh, tag.name_en, tag.slug, tag.color, tag.sort_order],
    });
  }
  console.log("✓ Tags seeded");

  // Helper to find tag id by slug
  const tagId = (slug: string) => tags.find((t) => t.slug === slug)!.id;

  // ---- Tools ----
  const tools = [
    { name: "ChatGPT", description_zh: "地表最强，OpenAI的传奇对话大脑。", description_en: "The legendary conversational AI by OpenAI.", url: "https://chat.openai.com", icon: "💬", category: "models", tagSlugs: ["primary"], sort_order: 1 },
    { name: "Claude", description_zh: "代码、写作、长文本逻辑分析的不二之选。", description_en: "Best for code, writing, and long-text analysis.", url: "https://claude.ai", icon: "🧠", category: "models", tagSlugs: ["primary"], sort_order: 2 },
    { name: "Gemini", description_zh: "Google 的超强多模态全能旗舰大脑。", description_en: "Google's powerful multimodal AI.", url: "https://gemini.google.com", icon: "✨", category: "models", tagSlugs: ["primary"], sort_order: 3 },
    { name: "Grok", description_zh: "马斯克旗下，幽默且知晓实时互联网新鲜事的AI模型。", description_en: "Elon Musk's witty, real-time AI model.", url: "https://grok.x.ai", icon: "✖", category: "models", tagSlugs: ["primary"], sort_order: 4 },
    { name: "豆包 (Doubao)", description_zh: "字节跳动出品，响应极快且非常懂中文语境。", description_en: "ByteDance's fast Chinese-first AI.", url: "https://www.doubao.com", icon: "🥟", category: "models", tagSlugs: ["primary"], sort_order: 5 },
    { name: "Perplexity", description_zh: "提供深度引用答案的革命性AI搜索引擎。", description_en: "Revolutionary AI search engine with citations.", url: "https://www.perplexity.ai", icon: "🔍", category: "models", tagSlugs: ["search"], sort_order: 6 },
    { name: "Notion", description_zh: "集笔记、数据库与项目管理于一体的神级工作区。", description_en: "All-in-one workspace for notes, databases, and project management.", url: "https://www.notion.so", icon: "📝", category: "productivity", tagSlugs: ["notes", "pm"], sort_order: 1 },
    { name: "Lark", description_zh: "先进的企业协作与文档管理平台（飞书海外版）。", description_en: "Advanced enterprise collaboration platform.", url: "https://www.larksuite.com", icon: "🕊️", category: "productivity", tagSlugs: ["notes"], sort_order: 2 },
    { name: "Clickup", description_zh: "高度自由配置的全能项目管理和协作工具。", description_en: "Highly configurable project management tool.", url: "https://clickup.com", icon: "✅", category: "productivity", tagSlugs: ["pm"], sort_order: 3 },
  ];

  for (const t of tools) {
    const toolId = createId();
    const catId = categories.find((c) => c.slug === t.category)!.id;
    await db.execute({
      sql: `INSERT OR IGNORE INTO tools (id, name, description_zh, description_en, url, icon, category_id, sort_order, is_published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      args: [toolId, t.name, t.description_zh, t.description_en, t.url, t.icon, catId, t.sort_order],
    });
    for (const slug of t.tagSlugs) {
      await db.execute({
        sql: "INSERT OR IGNORE INTO tool_tags (tool_id, tag_id) VALUES (?, ?)",
        args: [toolId, tagId(slug)],
      });
    }
  }
  console.log("✓ Tools seeded");

  // ---- Events ----
  const events = [
    {
      id: createId(), title_zh: "AI 工具工作坊：从零到一", title_en: "AI Tools Workshop: From Zero to One",
      description_zh: "一起动手体验最新的AI工具，适合初学者。", description_en: "Hands-on experience with the latest AI tools.",
      content_zh: "# AI 工具工作坊\n\n本次工作坊将带你体验最新的AI工具...", content_en: "",
      cover_image: "", date_start: "2026-04-15", date_end: "2026-04-15",
      location: "线上 Zoom", tagSlugs: ["workshop", "free"],
      external_url: "", is_published: 1,
    },
    {
      id: createId(), title_zh: "Vibecoding 氛围编程分享会", title_en: "Vibecoding Sharing Session",
      description_zh: "用嘴巴写程序的魔法时代！一起来聊 Vibecoding。", description_en: "The magic era of coding by talking!",
      content_zh: "# Vibecoding 分享会\n\n现在做软件像玩游戏一样好玩啦！", content_en: "",
      cover_image: "", date_start: "2026-04-20", date_end: "",
      location: "线上", tagSlugs: ["meetup", "free"],
      external_url: "", is_published: 1,
    },
  ];

  for (const e of events) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO events (id, title_zh, title_en, description_zh, description_en, content_zh, content_en, cover_image, date_start, date_end, location, external_url, is_published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [e.id, e.title_zh, e.title_en, e.description_zh, e.description_en, e.content_zh, e.content_en, e.cover_image, e.date_start, e.date_end, e.location, e.external_url, e.is_published],
    });
    for (const slug of e.tagSlugs) {
      await db.execute({
        sql: "INSERT OR IGNORE INTO event_tags (event_id, tag_id) VALUES (?, ?)",
        args: [e.id, tagId(slug)],
      });
    }
  }
  console.log("✓ Events seeded");

  // ---- Posts ----
  const posts = [
    {
      id: createId(), title_zh: "用嘴巴写程序的魔法时代（Vibecoding）", title_en: "The Magic Era of Vibecoding",
      slug: "vibecoding-intro",
      content_zh: "现在做软件像玩游戏一样好玩啦！我们不再需要一行行敲枯燥的代码。通过和机器人们聊天许愿，原来要一个月才能做完的心血，现在几小时就能变出来！这也就是传说中的\"氛围编程\" (Vibecoding)。",
      content_en: "",
      excerpt_zh: "现在做软件像玩游戏一样好玩啦！", excerpt_en: "Making software is as fun as playing games!",
      cover_image: "", author: "FunnelDuo",
      tagSlugs: ["vibecoding", "ai"], is_published: 1,
    },
    {
      id: createId(), title_zh: "2026年最值得关注的AI工具", title_en: "Top AI Tools to Watch in 2026",
      slug: "top-ai-tools-2026",
      content_zh: "# 2026年最值得关注的AI工具\n\n随着AI技术的飞速发展，越来越多的工具涌现出来...\n\n## ChatGPT\n依然是最强的对话AI...\n\n## Claude\n在代码和长文本方面表现卓越...",
      content_en: "",
      excerpt_zh: "随着AI技术的飞速发展，越来越多的工具涌现出来。", excerpt_en: "As AI evolves rapidly, more tools are emerging.",
      cover_image: "", author: "FunnelDuo",
      tagSlugs: ["ai", "tools"], is_published: 1,
    },
  ];

  for (const p of posts) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO posts (id, title_zh, title_en, slug, content_zh, content_en, excerpt_zh, excerpt_en, cover_image, author, is_published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [p.id, p.title_zh, p.title_en, p.slug, p.content_zh, p.content_en, p.excerpt_zh, p.excerpt_en, p.cover_image, p.author, p.is_published],
    });
    for (const slug of p.tagSlugs) {
      await db.execute({
        sql: "INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)",
        args: [p.id, tagId(slug)],
      });
    }
  }
  console.log("✓ Posts seeded");

  console.log("\nSeed complete!");
  db.close();
}

seed().catch(console.error);
