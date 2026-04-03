import { createClient } from "@libsql/client";
import { createId } from "@paralleldrive/cuid2";

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

  // ---- Clear existing data ----
  await db.execute("DELETE FROM tool_tags");
  await db.execute("DELETE FROM event_tags");
  await db.execute("DELETE FROM post_tags");
  await db.execute("DELETE FROM tools");
  await db.execute("DELETE FROM events");
  await db.execute("DELETE FROM posts");
  await db.execute("DELETE FROM tags");
  await db.execute("DELETE FROM categories");
  console.log("✓ Cleared existing data");

  // ---- Categories ----
  const categories = [
    { id: createId(), name_zh: "主要AI大脑", name_en: "AI Models", slug: "models", sort_order: 1 },
    { id: createId(), name_zh: "AI图片", name_en: "AI Images", slug: "images", sort_order: 2 },
    { id: createId(), name_zh: "AI视频", name_en: "AI Video", slug: "video", sort_order: 3 },
    { id: createId(), name_zh: "电商图", name_en: "E-commerce Design", slug: "ecommerce", sort_order: 4 },
    { id: createId(), name_zh: "数字人", name_en: "Digital Avatar", slug: "avatar", sort_order: 5 },
    { id: createId(), name_zh: "做PPT", name_en: "Presentations", slug: "presentations", sort_order: 6 },
    { id: createId(), name_zh: "灵感/笔记", name_en: "Notes & Inspiration", slug: "notes", sort_order: 7 },
    { id: createId(), name_zh: "图表", name_en: "Diagrams & Charts", slug: "diagrams", sort_order: 8 },
    { id: createId(), name_zh: "做网站", name_en: "Website Building", slug: "website", sort_order: 9 },
    { id: createId(), name_zh: "AI搜索", name_en: "AI Search", slug: "search", sort_order: 10 },
    { id: createId(), name_zh: "读书/学习", name_en: "Reading & Learning", slug: "reading", sort_order: 11 },
    { id: createId(), name_zh: "会议/转录", name_en: "Meetings & Transcript", slug: "meetings", sort_order: 12 },
    { id: createId(), name_zh: "项目管理", name_en: "Project Management", slug: "pm", sort_order: 13 },
    { id: createId(), name_zh: "Vibecoding", name_en: "Vibecoding", slug: "vibecoding", sort_order: 14 },
    { id: createId(), name_zh: "自动化/AI Agent", name_en: "Automation & AI Agent", slug: "automation", sort_order: 15 },
    { id: createId(), name_zh: "最近推荐", name_en: "Recent Top Picks", slug: "picks", sort_order: 16 },
  ];

  for (const c of categories) {
    await db.execute({
      sql: "INSERT INTO categories (id, name_zh, name_en, slug, sort_order) VALUES (?, ?, ?, ?, ?)",
      args: [c.id, c.name_zh, c.name_en, c.slug, c.sort_order],
    });
  }
  console.log("✓ Categories seeded");

  // Helper
  const catId = (slug: string) => categories.find((c) => c.slug === slug)!.id;

  // ---- Tags ----
  const tags = [
    { id: createId(), name_zh: "团队最爱", name_en: "Team Favorite", slug: "team-fav", color: "#6366f1", sort_order: 1 },
    { id: createId(), name_zh: "热门", name_en: "Hot", slug: "hot", color: "#ef4444", sort_order: 2 },
    { id: createId(), name_zh: "新", name_en: "New", slug: "new", color: "#f97316", sort_order: 3 },
    { id: createId(), name_zh: "Workshop", name_en: "Workshop", slug: "workshop", color: "#8b5cf6", sort_order: 4 },
    { id: createId(), name_zh: "线上活动", name_en: "Meetup", slug: "meetup", color: "#ec4899", sort_order: 5 },
    { id: createId(), name_zh: "免费", name_en: "Free", slug: "free", color: "#22c55e", sort_order: 6 },
    { id: createId(), name_zh: "AI", name_en: "AI", slug: "ai", color: "#0ea5e9", sort_order: 7 },
    { id: createId(), name_zh: "Vibecoding", name_en: "Vibecoding", slug: "vibecoding", color: "#f97316", sort_order: 8 },
    { id: createId(), name_zh: "工具", name_en: "Tools", slug: "tools", color: "#64748b", sort_order: 9 },
  ];

  for (const tag of tags) {
    await db.execute({
      sql: "INSERT INTO tags (id, name_zh, name_en, slug, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
      args: [tag.id, tag.name_zh, tag.name_en, tag.slug, tag.color, tag.sort_order],
    });
  }
  console.log("✓ Tags seeded");

  const tagId = (slug: string) => tags.find((t) => t.slug === slug)!.id;

  // ---- Tools ----
  const tools = [
    // === 主要AI大脑 ===
    { name: "Gemini", description_zh: "Google 的超强多模态全能旗舰大脑，搜索整合最强。", description_en: "Google's powerful multimodal AI with best search integration.", url: "https://gemini.google.com", icon: "✨", category: "models", pricing: "freemium", tagSlugs: ["team-fav"], sort_order: 1 },
    { name: "ChatGPT", description_zh: "地表最强，OpenAI的传奇对话大脑。", description_en: "The legendary conversational AI by OpenAI.", url: "https://chat.openai.com", icon: "💬", category: "models", pricing: "freemium", tagSlugs: ["team-fav"], sort_order: 2 },
    { name: "Claude", description_zh: "代码、写作、长文本逻辑分析的不二之选。", description_en: "Best for code, writing, and long-text analysis.", url: "https://claude.ai", icon: "🧠", category: "models", pricing: "freemium", tagSlugs: ["team-fav"], sort_order: 3 },
    { name: "Grok", description_zh: "马斯克旗下，幽默且知晓实时互联网新鲜事的AI模型。", description_en: "Elon Musk's witty, real-time AI model.", url: "https://grok.x.ai", icon: "✖", category: "models", pricing: "freemium", tagSlugs: ["team-fav"], sort_order: 4 },
    { name: "豆包 (Doubao)", description_zh: "字节跳动出品，响应极快且非常懂中文语境。", description_en: "ByteDance's fast Chinese-first AI.", url: "https://www.doubao.com", icon: "🥟", category: "models", pricing: "freemium", tagSlugs: ["team-fav"], sort_order: 5 },

    // === AI图片 ===
    { name: "NanoBanana", description_zh: "AI图片生成工具，快速出图效果惊艳。", description_en: "AI image generation with stunning results.", url: "https://nanobanana.com", icon: "🍌", category: "images", pricing: "freemium", tagSlugs: [], sort_order: 1 },
    { name: "Higgsfield", description_zh: "AI驱动的创意图片与视觉内容生成。", description_en: "AI-driven creative image and visual content generation.", url: "https://higgsfield.ai", icon: "🎨", category: "images", pricing: "freemium", tagSlugs: [], sort_order: 2 },
    { name: "Canva", description_zh: "最受欢迎的在线设计平台，内置AI图片功能。", description_en: "Most popular online design platform with built-in AI.", url: "https://www.canva.com", icon: "🎯", category: "images", pricing: "freemium", tagSlugs: [], sort_order: 3 },
    { name: "Figma", description_zh: "专业级UI设计工具，支持AI辅助设计。", description_en: "Professional UI design tool with AI-assisted features.", url: "https://www.figma.com", icon: "🖼️", category: "images", pricing: "freemium", tagSlugs: [], sort_order: 4 },
    { name: "Midjourney", description_zh: "顶级AI艺术图片生成，画风精美细腻。", description_en: "Top-tier AI art generation with exquisite style.", url: "https://www.midjourney.com", icon: "🌌", category: "images", pricing: "paid", tagSlugs: ["hot"], sort_order: 5 },

    // === AI视频 ===
    { name: "Veo3", description_zh: "Google 最新AI视频生成模型，效果震撼。", description_en: "Google's latest AI video generation model.", url: "https://deepmind.google/technologies/veo/", icon: "🎬", category: "video", pricing: "freemium", tagSlugs: ["hot", "new"], sort_order: 1 },
    { name: "Kling", description_zh: "快手旗下AI视频生成，支持长视频和特效。", description_en: "Kuaishou's AI video generation with long-form support.", url: "https://klingai.com", icon: "🎥", category: "video", pricing: "freemium", tagSlugs: [], sort_order: 2 },
    { name: "ElevenLabs", description_zh: "业界最强AI语音合成与克隆平台。", description_en: "Industry-leading AI voice synthesis and cloning.", url: "https://elevenlabs.io", icon: "🔊", category: "video", pricing: "freemium", tagSlugs: [], sort_order: 3 },
    { name: "Runway", description_zh: "创意人士首选的AI视频编辑与生成工具。", description_en: "AI video editing and generation for creatives.", url: "https://runwayml.com", icon: "🎞️", category: "video", pricing: "freemium", tagSlugs: [], sort_order: 4 },
    { name: "Seedance", description_zh: "字节跳动AI舞蹈与动态视频生成。", description_en: "ByteDance's AI dance and dynamic video generation.", url: "https://seedance.ai", icon: "💃", category: "video", pricing: "freemium", tagSlugs: ["new"], sort_order: 5 },

    // === 电商图 ===
    { name: "DesignKit", description_zh: "专为电商场景打造的AI商品图片生成工具。", description_en: "AI product image generation built for e-commerce.", url: "https://designkit.ai", icon: "🛍️", category: "ecommerce", pricing: "paid", tagSlugs: [], sort_order: 1 },

    // === 数字人 ===
    { name: "HeyGen", description_zh: "AI数字人视频制作平台，支持多语言口播。", description_en: "AI digital avatar video platform with multilingual support.", url: "https://www.heygen.com", icon: "🧑‍💼", category: "avatar", pricing: "freemium", tagSlugs: [], sort_order: 1 },
    { name: "hifly.cc", description_zh: "国内领先的AI数字人直播与短视频工具。", description_en: "Leading Chinese AI digital avatar for live streaming.", url: "https://hifly.cc", icon: "🤖", category: "avatar", pricing: "paid", tagSlugs: [], sort_order: 2 },

    // === 做PPT ===
    { name: "Gamma", description_zh: "AI一键生成精美PPT和演示文稿。", description_en: "AI-powered beautiful presentation generation.", url: "https://gamma.app", icon: "📊", category: "presentations", pricing: "freemium", tagSlugs: ["team-fav"], sort_order: 1 },
    { name: "Figma (Slides)", description_zh: "用Figma的专业设计能力做PPT演示。", description_en: "Use Figma's professional design for presentations.", url: "https://www.figma.com", icon: "🖼️", category: "presentations", pricing: "freemium", tagSlugs: [], sort_order: 2 },

    // === 灵感/笔记 ===
    { name: "Notion", description_zh: "集笔记、数据库与项目管理于一体的神级工作区。", description_en: "All-in-one workspace for notes, databases, and project management.", url: "https://www.notion.so", icon: "📝", category: "notes", pricing: "freemium", tagSlugs: ["team-fav"], sort_order: 1 },
    { name: "Lark", description_zh: "先进的企业协作与文档管理平台（飞书海外版）。", description_en: "Advanced enterprise collaboration platform.", url: "https://www.larksuite.com", icon: "🕊️", category: "notes", pricing: "freemium", tagSlugs: ["team-fav"], sort_order: 2 },

    // === 图表 ===
    { name: "Xmind AI", description_zh: "智能思维导图工具，AI辅助快速整理思路。", description_en: "Smart mind mapping tool with AI-assisted brainstorming.", url: "https://xmind.ai", icon: "🧩", category: "diagrams", pricing: "freemium", tagSlugs: [], sort_order: 1 },
    { name: "Napkin AI", description_zh: "把文字自动转换成精美图表和可视化。", description_en: "Automatically turn text into beautiful diagrams.", url: "https://www.napkin.ai", icon: "🗺️", category: "diagrams", pricing: "freemium", tagSlugs: [], sort_order: 2 },

    // === 做网站 ===
    { name: "Lovable", description_zh: "AI对话式建站工具，说出想法就能生成网站。", description_en: "AI conversational website builder.", url: "https://lovable.dev", icon: "💜", category: "website", pricing: "freemium", tagSlugs: ["hot"], sort_order: 1 },
    { name: "Firebase Studio", description_zh: "Google 的AI应用开发平台，全栈一站式。", description_en: "Google's AI app development platform.", url: "https://firebase.google.com", icon: "🔥", category: "website", pricing: "freemium", tagSlugs: [], sort_order: 2 },

    // === AI搜索 ===
    { name: "Perplexity", description_zh: "提供深度引用答案的革命性AI搜索引擎。", description_en: "Revolutionary AI search engine with citations.", url: "https://www.perplexity.ai", icon: "🔍", category: "search", pricing: "freemium", tagSlugs: ["team-fav"], sort_order: 1 },

    // === 读书/学习 ===
    { name: "NotebookLM", description_zh: "Google的AI读书笔记助手，上传资料自动总结。", description_en: "Google's AI reading assistant that auto-summarizes your materials.", url: "https://notebooklm.google.com", icon: "📚", category: "reading", pricing: "free", tagSlugs: [], sort_order: 1 },
    { name: "Cluely", description_zh: "AI学习辅助工具，考试复习的秘密武器。", description_en: "AI study assistant and exam prep secret weapon.", url: "https://cluely.com", icon: "🎓", category: "reading", pricing: "freemium", tagSlugs: [], sort_order: 2 },

    // === 会议/转录 ===
    { name: "TurboScribe", description_zh: "极速AI视频/音频转文字，支持多语言。", description_en: "Ultra-fast AI video/audio transcription with multilingual support.", url: "https://turboscribe.ai", icon: "📜", category: "meetings", pricing: "freemium", tagSlugs: [], sort_order: 1 },

    // === 项目管理 ===
    { name: "Notion (PM)", description_zh: "用Notion管理项目任务、看板和团队协作。", description_en: "Manage projects, kanban boards and team collaboration with Notion.", url: "https://www.notion.so", icon: "📝", category: "pm", pricing: "freemium", tagSlugs: ["team-fav"], sort_order: 1 },
    { name: "ClickUp", description_zh: "高度自由配置的全能项目管理和协作工具。", description_en: "Highly configurable project management tool.", url: "https://clickup.com", icon: "✅", category: "pm", pricing: "freemium", tagSlugs: [], sort_order: 2 },

    // === Vibecoding ===
    { name: "Cursor", description_zh: "AI代码编辑器，像聊天一样写代码。", description_en: "AI code editor — code like you're chatting.", url: "https://cursor.com", icon: "⚡", category: "vibecoding", pricing: "freemium", tagSlugs: ["team-fav", "hot"], sort_order: 1 },
    { name: "Antigravity", description_zh: "AI全栈应用构建平台，不写代码做产品。", description_en: "AI full-stack app builder — no code needed.", url: "https://antigravity.dev", icon: "🚀", category: "vibecoding", pricing: "freemium", tagSlugs: ["new"], sort_order: 2 },
    { name: "GitHub", description_zh: "全球最大的代码托管平台，集成Copilot AI助手。", description_en: "World's largest code hosting platform with Copilot AI.", url: "https://github.com", icon: "🐙", category: "vibecoding", pricing: "freemium", tagSlugs: [], sort_order: 3 },
    { name: "Vercel", description_zh: "前端部署首选平台，零配置秒级上线。", description_en: "Best-in-class frontend deployment platform.", url: "https://vercel.com", icon: "▲", category: "vibecoding", pricing: "freemium", tagSlugs: [], sort_order: 4 },

    // === 自动化/AI Agent ===
    { name: "n8n", description_zh: "开源的工作流自动化平台，可视化连接各种应用。", description_en: "Open-source workflow automation with visual app connections.", url: "https://n8n.io", icon: "🔗", category: "automation", pricing: "freemium", tagSlugs: ["team-fav"], sort_order: 1 },
    { name: "Coze", description_zh: "字节跳动出品的AI Bot搭建平台，零代码创建AI Agent。", description_en: "ByteDance's no-code AI bot/agent builder.", url: "https://www.coze.com", icon: "🤖", category: "automation", pricing: "freemium", tagSlugs: [], sort_order: 2 },

    // === 最近推荐 ===
    { name: "Open Claw 养小龙虾", description_zh: "最近超火的AI养小龙虾游戏，解压又好玩。", description_en: "Trending AI claw machine game — relaxing and fun.", url: "https://openclaw.com", icon: "🦞", category: "picks", pricing: "free", tagSlugs: ["hot", "new"], sort_order: 1 },
  ];

  for (const t of tools) {
    const toolId = createId();
    await db.execute({
      sql: `INSERT INTO tools (id, name, description_zh, description_en, url, icon, category_id, pricing, sort_order, is_published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      args: [toolId, t.name, t.description_zh, t.description_en, t.url, t.icon, catId(t.category), t.pricing, t.sort_order],
    });
    for (const slug of t.tagSlugs) {
      await db.execute({
        sql: "INSERT INTO tool_tags (tool_id, tag_id) VALUES (?, ?)",
        args: [toolId, tagId(slug)],
      });
    }
  }
  console.log(`✓ ${tools.length} Tools seeded`);

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
      sql: `INSERT INTO events (id, title_zh, title_en, description_zh, description_en, content_zh, content_en, cover_image, date_start, date_end, location, external_url, is_published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [e.id, e.title_zh, e.title_en, e.description_zh, e.description_en, e.content_zh, e.content_en, e.cover_image, e.date_start, e.date_end, e.location, e.external_url, e.is_published],
    });
    for (const slug of e.tagSlugs) {
      await db.execute({
        sql: "INSERT INTO event_tags (event_id, tag_id) VALUES (?, ?)",
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
      sql: `INSERT INTO posts (id, title_zh, title_en, slug, content_zh, content_en, excerpt_zh, excerpt_en, cover_image, author, is_published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [p.id, p.title_zh, p.title_en, p.slug, p.content_zh, p.content_en, p.excerpt_zh, p.excerpt_en, p.cover_image, p.author, p.is_published],
    });
    for (const slug of p.tagSlugs) {
      await db.execute({
        sql: "INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)",
        args: [p.id, tagId(slug)],
      });
    }
  }
  console.log("✓ Posts seeded");

  console.log("\nSeed complete!");
  db.close();
}

seed().catch(console.error);
