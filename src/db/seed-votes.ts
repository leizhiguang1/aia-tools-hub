import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Vote counts to seed — focus on the most popular tools
// with realistic-looking numbers (not all round numbers)
const voteData: Record<string, number> = {
  // 超强AI大脑 — these should be the highest
  "tool-chatgpt":    1847,
  "tool-claude":     1623,
  "tool-gemini":     1389,
  "tool-deepseek":    974,
  "tool-doubao":      712,
  "tool-grok":        583,

  // AI设计
  "tool-midjourney":  1156,
  "tool-canva":       832,
  "tool-figma":       764,
  "tool-stitch":      341,
  "tool-nanobanana":  215,
  "tool-higgsfield":  178,
  "tool-designkit":   143,

  // AI视频
  "tool-runway":      926,
  "tool-veo3":        687,
  "tool-kling":       534,
  "tool-elevenlabs":  412,
  "tool-heygen":      389,
  "tool-seedance":    267,
  "tool-hifly":       198,

  // 做PPT
  "tool-gamma":       653,
  "tool-notebooklm":  487,
  "tool-figma-slides": 312,

  // AI学习灵感
  "tool-notion":      891,
  "tool-lark":        456,
  "tool-notebooklm-2": 378,
  "tool-cluely":      234,

  // AI图表
  "tool-napkin":      347,
  "tool-xmind":       289,

  // AI网站
  "tool-lovable":     578,
  "tool-aistudio":    423,
  "tool-stitch-2":    267,

  // AI会议/研究
  "tool-perplexity":  812,
  "tool-readai":      345,
  "tool-turboscript": 213,

  // Vibecoding
  "tool-cursor":     1432,
  "tool-github":      967,
  "tool-vercel":      654,
  "tool-obsidian":    423,
  "tool-antigravity": 287,

  // AI Agent
  "tool-n8n":         534,
  "tool-coze":        389,

  // AI管理
  "tool-clickup":     412,
  "tool-openclaw":    278,
  "tool-obsidian-2":  198,
};

async function seedVotes() {
  console.log("Seeding vote counts...\n");

  for (const [toolId, count] of Object.entries(voteData)) {
    const { error } = await supabase
      .from("tools")
      .update({ vote_count: count })
      .eq("id", toolId);

    if (error) {
      console.error(`  ✗ ${toolId}: ${error.message}`);
    } else {
      console.log(`  ✓ ${toolId}: ${count} votes`);
    }
  }

  console.log("\nDone! Seeded votes for", Object.keys(voteData).length, "tools.");
}

seedVotes().catch(console.error);
