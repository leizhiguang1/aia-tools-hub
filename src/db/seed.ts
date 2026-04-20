import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const categories = [
  { id: "cat-brain",       name: "超强AI大脑",       slug: "ai-brain",       sort_order: 1 },
  { id: "cat-design",      name: "AI设计",           slug: "ai-design",      sort_order: 2 },
  { id: "cat-video",       name: "AI视频",           slug: "ai-video",       sort_order: 3 },
  { id: "cat-ppt",         name: "做PPT",            slug: "ppt",            sort_order: 4 },
  { id: "cat-learn",       name: "AI学习灵感",       slug: "ai-learning",    sort_order: 5 },
  { id: "cat-chart",       name: "AI图表",           slug: "ai-chart",       sort_order: 6 },
  { id: "cat-website",     name: "AI网站",           slug: "ai-website",     sort_order: 7 },
  { id: "cat-meeting",     name: "AI会议/研究",      slug: "ai-meeting",     sort_order: 8 },
  { id: "cat-vibecoding",  name: "Vibecoding",       slug: "vibecoding",     sort_order: 9 },
  { id: "cat-agent",       name: "AI Agent 自动化",  slug: "ai-agent",       sort_order: 10 },
  { id: "cat-management",  name: "AI管理助手",       slug: "ai-management",  sort_order: 11 },
];

const tools = [
  // 超强AI大脑
  { id: "tool-gemini",       name: "Gemini",              description: "Google 的多模态 AI 模型，支持文本、图像、代码等多种任务",                      url: "https://gemini.google.com",          icon: "",  category_id: "cat-brain",      pricing: "freemium", sort_order: 1 },
  { id: "tool-chatgpt",      name: "ChatGPT",             description: "OpenAI 的对话式 AI，最广泛使用的 AI 助手之一",                                url: "https://chat.openai.com",            icon: "",  category_id: "cat-brain",      pricing: "freemium", sort_order: 2 },
  { id: "tool-claude",       name: "Claude",              description: "Anthropic 出品，擅长长文理解、写作与编程的 AI 助手",                           url: "https://claude.ai",                  icon: "",  category_id: "cat-brain",      pricing: "freemium", sort_order: 3 },
  { id: "tool-grok",         name: "Grok",                description: "xAI 推出的 AI 助手，实时联网、幽默风格",                                       url: "https://grok.x.ai",                  icon: "",  category_id: "cat-brain",      pricing: "freemium", sort_order: 4 },
  { id: "tool-doubao",       name: "豆包",                description: "字节跳动推出的 AI 助手，中文能力强大",                                         url: "https://www.doubao.com",             icon: "",  category_id: "cat-brain",      pricing: "free",     sort_order: 5 },
  { id: "tool-deepseek",     name: "Deepseek",            description: "深度求索推出的开源大模型，推理能力出色",                                       url: "https://chat.deepseek.com",          icon: "",  category_id: "cat-brain",      pricing: "free",     sort_order: 6 },

  // AI设计
  { id: "tool-stitch",       name: "Google Stitch",       description: "Google 的 AI 设计工具，快速将想法变成可交互原型",                               url: "https://stitch.withgoogle.com",      icon: "",  category_id: "cat-design",     pricing: "free",     sort_order: 1 },
  { id: "tool-nanobanana",   name: "NanoBanana",          description: "AI 驱动的设计工具，快速生成创意素材",                                           url: "https://nanobanana.com",             icon: "",  category_id: "cat-design",     pricing: "freemium", sort_order: 2 },
  { id: "tool-higgsfield",   name: "Higgsfield",          description: "AI 创意设计平台，专注视觉内容生成",                                             url: "https://higgsfield.ai",              icon: "",  category_id: "cat-design",     pricing: "freemium", sort_order: 3 },
  { id: "tool-canva",        name: "Canva",               description: "全球最受欢迎的在线设计平台，AI 功能持续增强",                                   url: "https://www.canva.com",              icon: "",  category_id: "cat-design",     pricing: "freemium", sort_order: 4 },
  { id: "tool-figma",        name: "Figma",               description: "专业 UI/UX 设计工具，团队协作的行业标准",                                       url: "https://www.figma.com",              icon: "",  category_id: "cat-design",     pricing: "freemium", sort_order: 5 },
  { id: "tool-designkit",    name: "DesignKit",           description: "AI 设计套件，快速产出高质量设计稿",                                             url: "https://designkit.ai",               icon: "",  category_id: "cat-design",     pricing: "freemium", sort_order: 6 },
  { id: "tool-midjourney",   name: "Midjourney",          description: "顶级 AI 图像生成工具，艺术风格独树一帜",                                       url: "https://www.midjourney.com",         icon: "",  category_id: "cat-design",     pricing: "paid",     sort_order: 7 },

  // AI视频
  { id: "tool-veo3",         name: "VEO3",                description: "Google DeepMind 推出的视频生成模型，画质惊人",                                   url: "https://deepmind.google/veo",        icon: "",  category_id: "cat-video",      pricing: "freemium", sort_order: 1 },
  { id: "tool-runway",       name: "Runway",              description: "专业级 AI 视频生成与编辑平台",                                                 url: "https://runwayml.com",               icon: "",  category_id: "cat-video",      pricing: "freemium", sort_order: 2 },
  { id: "tool-kling",        name: "Kling",               description: "快手推出的 AI 视频生成工具，效果出众",                                         url: "https://klingai.com",                icon: "",  category_id: "cat-video",      pricing: "freemium", sort_order: 3 },
  { id: "tool-elevenlabs",   name: "ElevenLabs",          description: "顶级 AI 语音合成平台，支持多语言克隆",                                         url: "https://elevenlabs.io",              icon: "",  category_id: "cat-video",      pricing: "freemium", sort_order: 4 },
  { id: "tool-heygen",       name: "HeyGen",              description: "AI 数字人视频平台，快速制作真人口播视频",                                       url: "https://www.heygen.com",             icon: "",  category_id: "cat-video",      pricing: "freemium", sort_order: 5 },
  { id: "tool-hifly",        name: "hifly.cc",            description: "AI 视频创作工具，简单易上手",                                                   url: "https://hifly.cc",                   icon: "",  category_id: "cat-video",      pricing: "freemium", sort_order: 6 },
  { id: "tool-seedance",     name: "Seedance",            description: "字节跳动旗下 AI 舞蹈/动作视频生成工具",                                        url: "https://seedance.ai",                icon: "",  category_id: "cat-video",      pricing: "freemium", sort_order: 7 },

  // 做PPT
  { id: "tool-gamma",        name: "Gamma",               description: "AI 一键生成精美演示文稿，告别 PPT 排版烦恼",                                   url: "https://gamma.app",                  icon: "",  category_id: "cat-ppt",        pricing: "freemium", sort_order: 1 },
  { id: "tool-figma-slides", name: "Figma (Slides)",      description: "Figma 的演示文稿功能，设计师友好的幻灯片工具",                                 url: "https://www.figma.com/slides",       icon: "",  category_id: "cat-ppt",        pricing: "freemium", sort_order: 2 },
  { id: "tool-notebooklm",   name: "Notebook LM",         description: "Google 的 AI 笔记工具，上传资料自动整理与问答",                                url: "https://notebooklm.google.com",      icon: "",  category_id: "cat-ppt",        pricing: "free",     sort_order: 3 },

  // AI学习灵感
  { id: "tool-notion",       name: "Notion",              description: "全能型知识管理与协作平台，内置 AI 写作助手",                                    url: "https://www.notion.so",              icon: "",  category_id: "cat-learn",      pricing: "freemium", sort_order: 1 },
  { id: "tool-lark",         name: "Lark",                description: "字节跳动企业协作套件，集文档、表格、会议于一体",                                url: "https://www.larksuite.com",          icon: "",  category_id: "cat-learn",      pricing: "freemium", sort_order: 2 },
  { id: "tool-notebooklm-2", name: "Notebook LM",        description: "Google 的 AI 笔记工具，上传资料自动整理与问答",                                url: "https://notebooklm.google.com",      icon: "",  category_id: "cat-learn",      pricing: "free",     sort_order: 3 },
  { id: "tool-cluely",       name: "Cluely",              description: "AI 学习辅助工具，帮你快速理解复杂概念",                                        url: "https://cluely.com",                 icon: "",  category_id: "cat-learn",      pricing: "freemium", sort_order: 4 },

  // AI图表
  { id: "tool-xmind",        name: "Xmind.ai",            description: "经典思维导图工具的 AI 版本，一句话生成脑图",                                   url: "https://xmind.ai",                   icon: "",  category_id: "cat-chart",      pricing: "freemium", sort_order: 1 },
  { id: "tool-napkin",       name: "Napkin AI",           description: "AI 自动将文字转成精美图表和信息图",                                             url: "https://www.napkin.ai",              icon: "",  category_id: "cat-chart",      pricing: "freemium", sort_order: 2 },

  // AI网站
  { id: "tool-lovable",      name: "Lovable",             description: "对话式 AI 建站工具，描述需求即可生成完整网站",                                  url: "https://lovable.dev",                icon: "",  category_id: "cat-website",    pricing: "freemium", sort_order: 1 },
  { id: "tool-aistudio",     name: "Google AI Studio",    description: "Google 的 AI 开发平台，快速原型和测试 AI 应用",                                url: "https://aistudio.google.com",        icon: "",  category_id: "cat-website",    pricing: "free",     sort_order: 2 },
  { id: "tool-stitch-2",     name: "Google Stitch",       description: "Google 的 AI 设计工具，快速将想法变成可交互原型",                               url: "https://stitch.withgoogle.com",      icon: "",  category_id: "cat-website",    pricing: "free",     sort_order: 3 },

  // AI会议/研究
  { id: "tool-readai",       name: "Read AI",             description: "AI 会议助手，自动记录、总结、生成待办事项",                                     url: "https://www.read.ai",                icon: "",  category_id: "cat-meeting",    pricing: "freemium", sort_order: 1 },
  { id: "tool-turboscript",  name: "TurboScript",         description: "AI 转录工具，快速将音视频转成文字",                                             url: "https://turboscript.ai",             icon: "",  category_id: "cat-meeting",    pricing: "freemium", sort_order: 2 },
  { id: "tool-perplexity",   name: "Perplexity",          description: "AI 搜索引擎，实时联网搜索并给出带引用的答案",                                   url: "https://www.perplexity.ai",          icon: "",  category_id: "cat-meeting",    pricing: "freemium", sort_order: 3 },

  // Vibecoding
  { id: "tool-cursor",       name: "Cursor",              description: "AI 驱动的代码编辑器，写代码的最佳搭档",                                        url: "https://cursor.sh",                  icon: "",  category_id: "cat-vibecoding", pricing: "freemium", sort_order: 1 },
  { id: "tool-antigravity",  name: "Google Antigravity",  description: "Google 实验性 AI 编程助手",                                                    url: "https://labs.google/antigravity",    icon: "",  category_id: "cat-vibecoding", pricing: "free",     sort_order: 2 },
  { id: "tool-github",       name: "GitHub",              description: "全球最大代码托管平台，Copilot AI 编程助手加持",                                 url: "https://github.com",                 icon: "",  category_id: "cat-vibecoding", pricing: "freemium", sort_order: 3 },
  { id: "tool-vercel",       name: "Vercel",              description: "前端部署平台，AI 功能加速开发流程",                                             url: "https://vercel.com",                 icon: "",  category_id: "cat-vibecoding", pricing: "freemium", sort_order: 4 },
  { id: "tool-obsidian",     name: "Obsidian",            description: "本地优先的知识管理工具，插件生态丰富",                                          url: "https://obsidian.md",                icon: "",  category_id: "cat-vibecoding", pricing: "freemium", sort_order: 5 },

  // AI Agent 自动化
  { id: "tool-n8n",          name: "n8n",                 description: "开源工作流自动化平台，可视化搭建 AI Agent",                                     url: "https://n8n.io",                     icon: "",  category_id: "cat-agent",      pricing: "freemium", sort_order: 1 },
  { id: "tool-coze",         name: "Coze",                description: "字节跳动 AI Bot 搭建平台，零代码创建智能体",                                   url: "https://www.coze.com",               icon: "",  category_id: "cat-agent",      pricing: "freemium", sort_order: 2 },

  // AI管理助手
  { id: "tool-openclaw",     name: "Openclaw",            description: "AI 驱动的项目管理与团队协作工具",                                               url: "https://openclaw.com",               icon: "",  category_id: "cat-management", pricing: "freemium", sort_order: 1 },
  { id: "tool-clickup",      name: "ClickUp",             description: "全能型项目管理平台，AI 助手提升团队效率",                                      url: "https://clickup.com",                icon: "",  category_id: "cat-management", pricing: "freemium", sort_order: 2 },
  { id: "tool-obsidian-2",   name: "Obsidian",            description: "本地优先的知识管理工具，插件生态丰富",                                          url: "https://obsidian.md",                icon: "",  category_id: "cat-management", pricing: "freemium", sort_order: 3 },
];

async function seed() {
  console.log("Seeding categories...");
  const { error: catError } = await supabase.from("categories").upsert(categories);
  if (catError) { console.error("Categories error:", catError); return; }
  console.log(`  ✓ ${categories.length} categories`);

  console.log("Seeding tools...");
  // Seed script creates the CN baseline; migration 008 handles per-market duplication.
  const toolsForCn = tools.map((t) => ({ ...t, market_id: "cn" }));
  const { error: toolError } = await supabase.from("tools").upsert(toolsForCn);
  if (toolError) { console.error("Tools error:", toolError); return; }
  console.log(`  ✓ ${tools.length} tools (market_id=cn)`);

  console.log("Done!");
}

seed();
