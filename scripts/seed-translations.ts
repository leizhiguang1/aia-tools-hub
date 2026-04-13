import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Locale = "en" | "ms" | "zh-TW";
type Row = {
  entity_type: "category" | "tool" | "tag" | "event";
  entity_id: string;
  locale: Locale;
  field: string;
  value: string;
};

// ============================================================
// CATEGORIES — name
// ============================================================
const categoryNames: Record<string, Record<Locale, string>> = {
  "cat-brain": {
    en: "AI Powerhouse",
    ms: "Otak AI Super",
    "zh-TW": "超強AI大腦",
  },
  "cat-design": {
    en: "AI Design",
    ms: "Reka Bentuk AI",
    "zh-TW": "AI設計",
  },
  "cat-video": {
    en: "AI Video",
    ms: "Video AI",
    "zh-TW": "AI影片",
  },
  "cat-ppt": {
    en: "Presentations",
    ms: "Buat PPT",
    "zh-TW": "做簡報",
  },
  "cat-learn": {
    en: "AI Learning & Inspiration",
    ms: "Pembelajaran & Inspirasi AI",
    "zh-TW": "AI學習靈感",
  },
  "cat-chart": {
    en: "AI Charts",
    ms: "Carta AI",
    "zh-TW": "AI圖表",
  },
  "cat-website": {
    en: "AI Website",
    ms: "Laman Web AI",
    "zh-TW": "AI網站",
  },
  "cat-meeting": {
    en: "AI Meeting & Research",
    ms: "Mesyuarat & Penyelidikan AI",
    "zh-TW": "AI會議/研究",
  },
  "cat-vibecoding": {
    en: "Vibecoding",
    ms: "Vibecoding",
    "zh-TW": "Vibecoding",
  },
  "cat-agent": {
    en: "AI Agent & Automation",
    ms: "AI Agent & Automasi",
    "zh-TW": "AI Agent 自動化",
  },
  "cat-management": {
    en: "AI Management Assistant",
    ms: "Pembantu Pengurusan AI",
    "zh-TW": "AI管理助手",
  },
};

// ============================================================
// TOOLS — description (and name for tools with Chinese names)
// ============================================================
const toolDescriptions: Record<string, Record<Locale, string>> = {
  "tool-gemini": {
    en: "Currently the team's favorite. Google's multimodal AI — handy for research and organizing info, and can even generate images and videos directly.",
    ms: "Kegemaran pasukan kami sekarang. Model AI multimodal Google — sangat berguna untuk cari maklumat & susun nota, malah boleh terus jana gambar dan video.",
    "zh-TW": "目前團隊們的最愛，Google 的多模態 AI 模型，查資料+整理很方便，還能直接設計圖和影片。",
  },
  "tool-chatgpt": {
    en: "OpenAI's conversational AI — the most widely used assistant. I use it for almost everything (writing, analysis, code) and its all-round ability is the most reliable.",
    ms: "AI perbualan OpenAI, pembantu AI yang paling banyak digunakan. Saya guna untuk hampir semua perkara (menulis/analisis/kod), keupayaannya paling stabil secara keseluruhan.",
    "zh-TW": "OpenAI 的對話式 AI，最廣泛使用的 AI 助手之一，我基本什麼都用它做（寫作/分析/程式），綜合能力最穩。",
  },
  "tool-claude": {
    en: "The strongest writing AI — great at long-form text and summaries, and sounds the most human. Recently surging again (Claude Code), though sometimes a bit slow.",
    ms: "AI penulisan paling kuat, sangat hebat untuk teks panjang dan ringkasan, ekspresi lebih seperti manusia. Baru-baru ini popular semula (Claude Code), tetapi kadang-kadang agak perlahan.",
    "zh-TW": "最強寫作型AI，長文本和總結能力很頂，表達更像人，最近熱度回升（Claude Code），但有時可能速度略慢。",
  },
  "tool-grok": {
    en: "Elon Musk's AI assistant — real-time web access, witty style, and barely any restrictions.",
    ms: "Pembantu AI keluaran Elon Musk, akses web masa nyata, gaya jenaka, dan hampir tiada had.",
    "zh-TW": "馬斯克推出的 AI 助手，即時聯網、幽默風格，沒有什麼限制。",
  },
  "tool-doubao": {
    en: "ByteDance's AI assistant — strong and fast at understanding Chinese. Mainly used for generating Chinese content with direct voice chat.",
    ms: "Pembantu AI keluaran ByteDance, kefahaman bahasa Cina sangat baik dan pantas, terutamanya digunakan untuk menjana kandungan dalam Bahasa Cina, boleh terus berbual.",
    "zh-TW": "字節跳動推出的 AI 助手，華文理解能力好又快，主要用來生成一些華語的內容，可以直接對話。",
  },
  "tool-deepseek": {
    en: "Cheap. An open-source large model from DeepSeek with excellent reasoning ability.",
    ms: "Murah. Model besar sumber terbuka dari DeepSeek dengan keupayaan penaakulan yang sangat baik.",
    "zh-TW": "便宜，深度求索推出的開源大模型，推理能力出色。",
  },
  "tool-stitch": {
    en: "Google's latest design tool — build simple websites/apps and quickly mock up your UI designs.",
    ms: "Alat reka bentuk terbaharu Google, boleh buat web/app ringkas dan cepat hasilkan reka bentuk UI anda.",
    "zh-TW": "Google 最新的設計工具，可以做簡單網頁/應用，快速做出你的UI設計等。",
  },
  "tool-nanobanana": {
    en: "Beginner-friendly (works right inside Gemini), great for quickly producing creative images. Sometimes laggy — adding a reference makes it more stable.",
    ms: "Mesra pemula (boleh terus guna dalam Gemini), sesuai untuk hasilkan imej kreatif dengan cepat, kadang-kadang tersangkut, sertakan reference untuk hasil yang lebih stabil.",
    "zh-TW": "小白很好上手（在Gemini裡就能用），適合快速出創意圖，但偶爾會卡，建議加reference更穩定。",
  },
  "tool-higgsfield": {
    en: "A creative-leaning visual generator — great for novel content, with a full design toolkit.",
    ms: "Alat penjanaan visual yang kreatif, sesuai untuk hasilkan kandungan yang lebih unik, lengkap dengan alat reka bentuk.",
    "zh-TW": "創意向的視覺生成工具，適合做一些比較新奇的內容，設計工具齊全。",
  },
  "tool-canva": {
    en: "The world's most popular online design platform — beginner-friendly, the go-to lazy design tool for quick PPTs and posters.",
    ms: "Platform reka bentuk dalam talian paling popular di dunia, sesuai untuk pemula, alat reka bentuk paling mudah untuk buat PPT/poster dengan cepat.",
    "zh-TW": "全球最受歡迎的線上設計平台，適合小白，最常用的「懶人設計工具」，做簡報/海報很快。",
  },
  "tool-figma": {
    en: "Professional UI/UX design tool — the industry standard for team collaboration.",
    ms: "Alat reka bentuk UI/UX profesional, standard industri untuk kerjasama pasukan.",
    "zh-TW": "專業 UI/UX 設計工具，團隊協作的行業標準。",
  },
  "tool-designkit": {
    en: "Meitu's latest AI — purpose-built for product/ad images and videos, perfect for beginners.",
    ms: "AI terbaharu dari Meitu, khusus untuk hasilkan gambar produk/iklan dan video, sesuai untuk pemula.",
    "zh-TW": "美圖旗下最新的AI，專門用來做商品圖/廣告圖的，還有影片，適合小白。",
  },
  "tool-midjourney": {
    en: "The image quality is truly top-tier — great for brand visuals and covers. You'll need to learn prompts though, which can be painful at first.",
    ms: "Kualiti imej memang terbaik, sangat sesuai untuk gambar jenama/kulit muka, tetapi perlu belajar prompt — agak menyakitkan untuk pemula.",
    "zh-TW": "出圖品質真的很頂，做品牌圖/封面很好用，但要學prompt，新手一開始會有點痛苦。",
  },
  "tool-veo3": {
    en: "Google DeepMind's video generation model — huge potential (text directly to video), but expensive.",
    ms: "Model penjanaan video dari Google DeepMind, potensi sangat besar (terus jana video dari teks), tetapi mahal.",
    "zh-TW": "Google DeepMind 推出的影片生成模型，潛力很大（文字直接生成影片），但是貴。",
  },
  "tool-runway": {
    en: "Professional-grade AI video generation and editing platform — an all-in-one AI video tool from generation to editing.",
    ms: "Platform penjanaan dan penyuntingan video AI gred profesional, alat video AI serba lengkap dari penjanaan hingga penyuntingan.",
    "zh-TW": "專業級 AI 影片生成與編輯平台，「全能」的AI影片工具，從生成到剪輯都能做。",
  },
  "tool-kling": {
    en: "Kuaishou's AI video generator — strong photorealism, with results that feel cinematic.",
    ms: "Alat penjanaan video AI dari Kuaishou, rasa visual yang sangat realistik, hasil video lebih 'sinematik'.",
    "zh-TW": "快手推出的 AI 影片生成工具，畫面真實感很強，做出來的影片比較「像電影」。",
  },
  "tool-elevenlabs": {
    en: "Top-tier AI voice synthesis — multilingual support, currently the strongest dubbing on the market and very lifelike.",
    ms: "Platform sintesis suara AI terbaik, sokongan pelbagai bahasa, kualiti suara antara yang terbaik dan sangat menyerupai suara manusia.",
    "zh-TW": "頂級 AI 語音合成平台，支援多語言，配音基本是目前最強，聲音很像真人。",
  },
  "tool-heygen": {
    en: "The strongest AI digital-human video platform — one of the most mature, quickly produces real-person voiceover videos and one-click translates between languages.",
    ms: "Platform video manusia digital AI paling kuat, antara yang paling matang, boleh hasilkan video voiceover seperti manusia sebenar dan tukar bahasa dengan satu klik.",
    "zh-TW": "最強AI 數位人影片平台，數位人裡算比較成熟的，可以快速製作真人口播影片，還可以一鍵轉換不同的語言。",
  },
  "tool-hifly": {
    en: "A great-value digital-human tool. We use it to mass-produce voiceover videos — using your own licensed voice gives more realistic results, and it's much cheaper than HeyGen.",
    ms: "Alat manusia digital yang sangat berbaloi, kami guna untuk hasilkan video voiceover secara pukal. Jika guna lesen suara sendiri, hasilnya lebih realistik, dan jauh lebih murah dari HeyGen.",
    "zh-TW": "性價比很高的數位人工具，我們用來批量做口播影片，如果用自己的聲音授權會更真實，比HeyGen便宜很多。",
  },
  "tool-seedance": {
    en: "ByteDance's AI dance/motion video generator.",
    ms: "Alat penjanaan video tarian/pergerakan AI dari ByteDance.",
    "zh-TW": "字節跳動旗下 AI 舞蹈/動作影片生成工具。",
  },
  "tool-gamma": {
    en: "Type one sentence and get a full slide deck — extremely fast.",
    ms: "Taip satu ayat dan dapatkan satu set PPT, sangat pantas.",
    "zh-TW": "輸入一句話就能出一套簡報，速度很快。",
  },
  "tool-figma-slides": {
    en: "Figma's presentation feature — designer-friendly slides.",
    ms: "Ciri persembahan Figma, mesra pereka bentuk.",
    "zh-TW": "Figma 的簡報功能，設計師友好。",
  },
  "tool-notebooklm": {
    en: "Google's AI note-taking tool — upload sources and it organizes & answers questions, even producing beautiful slide decks for you.",
    ms: "Alat catatan AI Google, muat naik bahan dan ia akan susun & jawab soalan secara automatik, malah terus hasilkan PPT yang menarik untuk anda.",
    "zh-TW": "Google 的 AI 筆記工具，上傳資料自動整理與問答，直接幫你做出美美的簡報。",
  },
  "tool-notion": {
    en: "All-in-one knowledge management & collaboration platform — my long-term 'second brain' for notes and project management, with a built-in AI writing assistant.",
    ms: "Platform pengurusan pengetahuan & kolaborasi serba lengkap, 'otak kedua' peribadi saya untuk jangka panjang. Boleh buat nota + pengurusan projek, dan dilengkapi pembantu penulisan AI.",
    "zh-TW": "全能型知識管理與協作平台，個人長期在用的「第二大腦」，可以做筆記+專案管理，還內建 AI 寫作助手。",
  },
  "tool-lark": {
    en: "Best for teams and enterprises. ByteDance's collaboration suite — docs, sheets, and meetings all in one.",
    ms: "Lebih sesuai untuk pasukan & syarikat. Suite kolaborasi korporat ByteDance — dokumen, hamparan, dan mesyuarat dalam satu.",
    "zh-TW": "比較適合團隊企業，字節跳動企業協作套件，集文件、表格、會議於一體。",
  },
  "tool-notebooklm-2": {
    en: "Google's AI note-taking tool — upload sources and it organizes & answers questions automatically.",
    ms: "Alat catatan AI Google, muat naik bahan dan ia akan susun & jawab soalan secara automatik.",
    "zh-TW": "Google 的 AI 筆記工具，上傳資料自動整理與問答。",
  },
  "tool-cluely": {
    en: "AI study aid that helps you quickly grasp complex concepts.",
    ms: "Alat bantu pembelajaran AI yang membantu anda memahami konsep kompleks dengan cepat.",
    "zh-TW": "AI 學習輔助工具，幫你快速理解複雜概念。",
  },
  "tool-xmind": {
    en: "The classic mind-mapping tool, AI edition — generate a mind map from one sentence.",
    ms: "Alat peta minda klasik versi AI, hasilkan peta minda dengan satu ayat sahaja.",
    "zh-TW": "經典心智圖工具的 AI 版本，一句話生成心智圖。",
  },
  "tool-napkin": {
    en: "AI that automatically turns text into beautiful charts and infographics.",
    ms: "AI yang menukar teks kepada carta dan infografik yang menarik secara automatik.",
    "zh-TW": "AI 自動將文字轉成精美圖表和資訊圖。",
  },
  "tool-lovable": {
    en: "Conversational AI website builder — describe what you need and get a complete site.",
    ms: "Alat bina laman web AI berbentuk perbualan, terangkan keperluan anda dan ia akan hasilkan laman web yang lengkap.",
    "zh-TW": "對話式 AI 建站工具，描述需求即可生成完整網站。",
  },
  "tool-aistudio": {
    en: "Google's AI development platform — quickly prototype and test AI applications.",
    ms: "Platform pembangunan AI Google, untuk prototaip dan ujian aplikasi AI dengan pantas.",
    "zh-TW": "Google 的 AI 開發平台，快速原型和測試 AI 應用。",
  },
  "tool-stitch-2": {
    en: "Google's AI design tool — quickly turn ideas into interactive prototypes.",
    ms: "Alat reka bentuk AI Google, ubah idea kepada prototaip interaktif dengan pantas.",
    "zh-TW": "Google 的 AI 設計工具，快速將想法變成可互動原型。",
  },
  "tool-readai": {
    en: "AI meeting assistant — automatically records, summarizes, and generates to-do items.",
    ms: "Pembantu mesyuarat AI, merekod, meringkaskan, dan menjana senarai tugasan secara automatik.",
    "zh-TW": "AI 會議助手，自動記錄、總結、生成待辦事項。",
  },
  "tool-turboscript": {
    en: "AI transcription tool — quickly convert audio and video into text.",
    ms: "Alat transkripsi AI, menukar audio dan video kepada teks dengan pantas.",
    "zh-TW": "AI 轉錄工具，快速將音影片轉成文字。",
  },
  "tool-perplexity": {
    en: "AI search engine — real-time web search with cited answers.",
    ms: "Enjin carian AI, carian web masa nyata dengan jawapan yang disertakan rujukan.",
    "zh-TW": "AI 搜尋引擎，即時聯網搜尋並給出帶引用的答案。",
  },
  "tool-cursor": {
    en: "Cursor is great at writing code — I think it boosts developer productivity noticeably, but you still need a coding foundation.",
    ms: "Cursor sangat hebat untuk menulis kod, saya rasa ia meningkatkan produktiviti pembangun dengan ketara, tetapi anda masih perlukan asas pengaturcaraan.",
    "zh-TW": "AI寫程式很強，我覺得對開發者提升效率很明顯，但還是需要程式基礎。",
  },
  "tool-antigravity": {
    en: "A recent trend — Google's AI dev tool. Great for quickly building small product sites, easy enough that no coding background is needed.",
    ms: "Trend terkini, alat pembangunan AI Google, sesuai untuk membina laman produk kecil dengan pantas tanpa perlu tahu pengaturcaraan.",
    "zh-TW": "最近的trend，Google AI開發工具，適合快速做小產品網站等等，不需要會coding也能簡單上手。",
  },
  "tool-github": {
    en: "The world's largest code hosting platform, supercharged by Copilot AI — there's a bit of a learning curve for beginners.",
    ms: "Platform pengehosan kod terbesar di dunia, dilengkapi pembantu pengaturcaraan AI Copilot, ada sedikit halangan untuk pemula pada mulanya.",
    "zh-TW": "全球最大程式碼託管平台，Copilot AI 程式設計助手加持，新手一開始會有點門檻。",
  },
  "tool-vercel": {
    en: "Frontend deployment platform — AI features speed up the development workflow.",
    ms: "Platform penggunaan frontend, ciri AI mempercepatkan aliran kerja pembangunan.",
    "zh-TW": "前端部署平台，AI 功能加速開發流程。",
  },
  "tool-obsidian": {
    en: "Local-first knowledge management tool with a rich plugin ecosystem.",
    ms: "Alat pengurusan pengetahuan local-first dengan ekosistem plugin yang kaya.",
    "zh-TW": "本地優先的知識管理工具，外掛生態豐富。",
  },
  "tool-n8n": {
    en: "Open-source workflow automation platform — build AI agents visually.",
    ms: "Platform automasi aliran kerja sumber terbuka, bina AI Agent secara visual.",
    "zh-TW": "開源工作流自動化平台，視覺化搭建 AI Agent。",
  },
  "tool-coze": {
    en: "ByteDance's AI bot building platform — create intelligent agents with zero code.",
    ms: "Platform pembinaan AI Bot ByteDance, cipta ejen pintar tanpa kod.",
    "zh-TW": "字節跳動 AI Bot 搭建平台，零程式碼建立智能體。",
  },
  "tool-openclaw": {
    en: "AI-powered project management and team collaboration tool.",
    ms: "Alat pengurusan projek dan kerjasama pasukan dikuasakan AI.",
    "zh-TW": "AI 驅動的專案管理與團隊協作工具。",
  },
  "tool-clickup": {
    en: "All-in-one project management platform — AI assistant boosts team productivity.",
    ms: "Platform pengurusan projek serba lengkap, pembantu AI meningkatkan kecekapan pasukan.",
    "zh-TW": "全能型專案管理平台，AI 助手提升團隊效率。",
  },
  "tool-obsidian-2": {
    en: "Local-first knowledge management tool with a rich plugin ecosystem.",
    ms: "Alat pengurusan pengetahuan local-first dengan ekosistem plugin yang kaya.",
    "zh-TW": "本地優先的知識管理工具，外掛生態豐富。",
  },
};

// Tool name overrides (only for tools whose base name is in Chinese)
const toolNames: Record<string, Record<Locale, string>> = {
  "tool-doubao": {
    en: "Doubao",
    ms: "Doubao",
    "zh-TW": "豆包",
  },
};

// ============================================================
// TAGS — name
// ============================================================
const tagNames: Record<string, Record<Locale, string>> = {
  lpxzwa2uf9dpz4e206oz31f3: {
    en: "Most Used",
    ms: "Paling Kerap Digunakan",
    "zh-TW": "最常使用",
  },
  katjzlph54tn9i9w2wgrzzpc: {
    en: "Latest Trend 🔥",
    ms: "Trend Terkini 🔥",
    "zh-TW": "最新Trend🔥",
  },
  pv41pdg8cz3g2pdqncqy5iud: {
    en: "Favorites ❤️",
    ms: "Kegemaran ❤️",
    "zh-TW": "最愛 ❤️",
  },
};

// ============================================================
// EVENTS
// ============================================================
const events: Record<
  string,
  Record<Locale, { title: string; description: string; location: string; content: string }>
> = {
  ng7qs5uw1n9d2yoi6rhm85tj: {
    en: {
      title: "Malaysia's First AI Agency: How to Land US Clients with AI",
      description:
        "Learning AI tools is just the start — the key is how to use them to make money.\nWant to know how we earn an extra $2k–$3k USD a month with just a laptop + AI?",
      location: "Zoom Webinar",
      content:
        '<p>This year is a critical turning point.<br>Have you noticed that even <strong>parents and friends who never touched AI and don\'t know what ChatGPT is</strong> are now saying things like: "AI is getting really scary" "AI is getting really powerful." <br><br>It\'s not that these robots suddenly became insanely smart — it\'s that over the past two years, AI has grown faster than any other technology, and the daily updates are now so fast that ordinary people can use AI to find money-making opportunities.<br><br>Global giants are pouring money into AI. In just two years you\'ve seen ChatGPT, DeepSeek, MidJourney, Google VEO 3, and Sora burst onto the scene. AI is only just beginning, but many industries predict that the AI boom will be even bigger than the e-commerce, livestream, or advertising windows... <br>👉 <strong>This window of opportunity only lasts 2–3 years</strong><br><br>It might sound like it has nothing to do with us, but the opportunities AI brings —</p><p>are no longer just for big companies. <strong>AI now lets ordinary people get in and earn too.</strong></p><hr><p>You\'ve learned the AI tools — but want to know how we actually use AI to make money?<br><br>Then we invite you to join our:</p><blockquote><p>FREE 2-day sharing session <strong>"AI Beginners\' Online Freedom Business"</strong></p></blockquote><p>Over the two days we\'ll cover:</p><ul><li><p>What other ways are there for beginners to start an online business</p></li><li><p>Which AI tools you can use to make money</p></li><li><p>How to successfully break into the US market</p></li><li><p>The full process of earning USD from zero</p></li></ul><img src="https://nzmykhkriehznltaitqa.supabase.co/storage/v1/object/public/media/content/1775470440546-p8o7cp.png"><p></p>',
    },
    ms: {
      title: "Agensi AI Pertama Malaysia: Cara Dapatkan Klien Amerika Guna AI",
      description:
        "Belajar alat AI hanya permulaan — yang penting ialah bagaimana menggunakannya untuk hasilkan duit.\nNak tahu macam mana kami hasilkan tambahan $2k–$3k USD sebulan hanya dengan satu laptop + AI?",
      location: "Zoom Webinar",
      content:
        '<p>Tahun ini ialah satu titik penting.<br>Pernah perasan tak, walaupun <strong>ibu bapa dan kawan-kawan anda yang tak pernah sentuh AI dan tak tahu apa itu ChatGPT</strong>, sekarang mula cakap: "AI ni dah makin menakutkan" "AI ni makin GENG"? <br><br>Bukannya robot ini tiba-tiba jadi terlalu hebat — sebenarnya dalam dua tahun ini, kadar pertumbuhan AI sudah mengatasi mana-mana teknologi lain, dan kemas kininya sangat pantas sehinggakan orang biasa pun boleh guna AI untuk cari peluang hasilkan duit.<br><br>Syarikat-syarikat besar dunia menggila membelanjakan duit untuk AI. Hanya dalam masa dua tahun, anda boleh lihat ChatGPT, DeepSeek, MidJourney, Google VEO 3, Sora muncul satu demi satu. Walaupun AI baru sahaja bermula, banyak industri meramalkan ledakan AI akan lebih besar daripada peluang e-dagang, siaran langsung, atau pengiklanan... <br>👉 <strong>Tetingkap peluang ini hanya 2–3 tahun sahaja</strong><br><br>Bunyi macam tiada kena-mengena dengan kita, tapi sebenarnya peluang yang dibawa AI,</p><p>kini bukan hanya untuk syarikat besar. <strong>AI juga membolehkan orang biasa masuk dan hasilkan duit.</strong></p><hr><p>Anda dah belajar alat AI, tapi nak tahu macam mana kami sebenarnya guna AI untuk hasilkan duit?<br><br>Jemput sertai sesi:</p><blockquote><p>Sesi perkongsian PERCUMA 2 hari <strong>"Perniagaan Bebas Atas Talian Untuk Pemula AI"</strong></p></blockquote><p>Dalam 2 hari ini kami akan kongsikan:</p><ul><li><p>Apa lagi cara untuk pemula mulakan perniagaan dalam talian</p></li><li><p>Alat AI apa yang boleh hasilkan duit</p></li><li><p>Macam mana untuk berjaya masuk pasaran Amerika</p></li><li><p>Proses lengkap dari sifar untuk hasilkan duit USD</p></li></ul><img src="https://nzmykhkriehznltaitqa.supabase.co/storage/v1/object/public/media/content/1775470440546-p8o7cp.png"><p></p>',
    },
    "zh-TW": {
      title: "全馬首個AI Agency：教你用AI接美國客戶的玩法",
      description:
        "學會AI工具只是開始，關鍵是怎麼用來賺錢。\n想知道我們如何用一台電腦+AI，每月多賺$2k–$3k美金？",
      location: "Zoom Webinar",
      content:
        '<p>今年，是個非常重要的時間節點。<br>你有沒有發現，就連你身邊那些<strong>從來不碰AI、也不知道ChatGPT是什麼的父母和朋友</strong>，現在也開始說一句話：「AI真的越來越恐怖了」「AI真的越來越GENG了」 <br><br>不是這些機器人突然變得很變態很厲害，而是過去這兩年，它的成長速度已經超過任何一個技術，每天的更新快到普通人都可以靠這AI找到賺錢機會。<br><br>全球大公司瘋狂砸錢搞AI，短短兩年你就看到 ChatGPT、Deepseek、MidJourney、Google VEO 3、Sora 橫空出世，雖然AI只是剛剛開始，但很多行業預測：AI的爆發，會比電商、直播、廣告紅利還要大... <br>👉 <strong>這波紅利窗口，只有 2–3 年</strong><br><br>聽起來好像跟我們沒關係，但其實AI帶來的機會，</p><p>現在不是只有大公司才有，<strong>AI也能讓普通人進場賺錢了。</strong></p><hr><p>學會了AI工具，但你想要知道我們是怎樣用AI賺錢嗎？<br><br>那我們邀請你參加我們的：</p><blockquote><p>免費2天的分享會<strong>《AI小白網路自由創業》</strong></p></blockquote><p>我們會在這兩天講解：</p><ul><li><p>小白線上創業還有什麼方法</p></li><li><p>有什麼AI工具可以賺錢</p></li><li><p>如何成功打開美國市場</p></li><li><p>從0開始賺美金的完整流程</p></li></ul><img src="https://nzmykhkriehznltaitqa.supabase.co/storage/v1/object/public/media/content/1775470440546-p8o7cp.png"><p></p>',
    },
  },
  lhkhylsbrmpvabufoeyrhjfm: {
    en: {
      title: "The World's First Earn-USD Game 🎮 — Can You Get Rich and Free in 10 Months?",
      description:
        "Can you earn your first pot of USD on your own? Or will it be GAME OVER?",
      location: "Online Game",
      content:
        '<p>I created a game<br>that lets you experience earning USD as an entrepreneur,<br>starting from zero to find overseas clients.</p><p>You decide:</p><ul><li><p>What skills to learn?</p></li><li><p>How many employees to hire?</p></li><li><p>How to do your marketing?</p></li></ul><p>See if you can become rich and free within 10 months!</p><hr><p>Click the game link:</p><p>👉 <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.freedomgame.io">https://www.freedomgame.io</a> &nbsp;&nbsp;</p><p>How to play?</p><p>👉 <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.instagram.com/reel/DWJWAEIk_jc/?igsh=YjE0cWtndXRia3Zp">https://www.instagram.com/reel/DWJWAEIk_jc/?igsh=YjE0cWtndXRia3Zp</a></p><img src="https://nzmykhkriehznltaitqa.supabase.co/storage/v1/object/public/media/content/1775470520165-gouqeo.png"><p></p>',
    },
    ms: {
      title: "Permainan Cari USD Pertama Di Dunia 🎮 — Boleh Tak Anda Jadi Kaya & Bebas Dalam 10 Bulan?",
      description:
        "Mampukah anda hasilkan duit USD pertama anda sendiri? Atau terus GAME OVER?",
      location: "Online Game",
      content:
        '<p>Saya cipta sebuah permainan,<br>untuk semua orang merasai pengalaman bina perniagaan dan hasilkan USD,<br>bermula dari sifar untuk cari klien luar negara.</p><p>Anda yang tentukan:</p><ul><li><p>Skil apa yang nak belajar?</p></li><li><p>Berapa ramai pekerja yang nak diambil?</p></li><li><p>Macam mana nak buat marketing?</p></li></ul><p>Lihat sama ada anda boleh jadi kaya dan bebas dalam masa 10 bulan!</p><hr><p>Klik pautan permainan:</p><p>👉 <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.freedomgame.io">https://www.freedomgame.io</a> &nbsp;&nbsp;</p><p>Cara main?</p><p>👉 <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.instagram.com/reel/DWJWAEIk_jc/?igsh=YjE0cWtndXRia3Zp">https://www.instagram.com/reel/DWJWAEIk_jc/?igsh=YjE0cWtndXRia3Zp</a></p><img src="https://nzmykhkriehznltaitqa.supabase.co/storage/v1/object/public/media/content/1775470520165-gouqeo.png"><p></p>',
    },
    "zh-TW": {
      title: "世界第一款賺美金遊戲 🎮 看你在 10個月內，能不能做到有錢有閒！",
      description:
        "你能不能靠自己賺到第一桶美金？還是直接GAME OVER？",
      location: "Online Game",
      content:
        '<p>我create了一款遊戲，<br>讓大家能在遊戲裡體驗賺美金創業，<br>先來體驗從0開始找到外國客戶，</p><p>你要自己決定：</p><ul><li><p>要學什麼技能？</p></li><li><p>要請多少的員工？</p></li><li><p>要怎樣做Marketing？</p></li></ul><p>看你在 10個月內，能不能做到有錢有閒！</p><hr><p>點擊遊戲連結：</p><p>👉 <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.freedomgame.io">https://www.freedomgame.io</a> &nbsp;&nbsp;</p><p>怎樣玩？</p><p>👉 <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.instagram.com/reel/DWJWAEIk_jc/?igsh=YjE0cWtndXRia3Zp">https://www.instagram.com/reel/DWJWAEIk_jc/?igsh=YjE0cWtndXRia3Zp</a></p><img src="https://nzmykhkriehznltaitqa.supabase.co/storage/v1/object/public/media/content/1775470520165-gouqeo.png"><p></p>',
    },
  },
};

// ============================================================
// Build rows
// ============================================================
const LOCALES: Locale[] = ["en", "ms", "zh-TW"];
const rows: Row[] = [];

for (const [id, byLocale] of Object.entries(categoryNames)) {
  for (const locale of LOCALES) {
    rows.push({ entity_type: "category", entity_id: id, locale, field: "name", value: byLocale[locale] });
  }
}

for (const [id, byLocale] of Object.entries(toolDescriptions)) {
  for (const locale of LOCALES) {
    rows.push({ entity_type: "tool", entity_id: id, locale, field: "description", value: byLocale[locale] });
  }
}

for (const [id, byLocale] of Object.entries(toolNames)) {
  for (const locale of LOCALES) {
    rows.push({ entity_type: "tool", entity_id: id, locale, field: "name", value: byLocale[locale] });
  }
}

for (const [id, byLocale] of Object.entries(tagNames)) {
  for (const locale of LOCALES) {
    rows.push({ entity_type: "tag", entity_id: id, locale, field: "name", value: byLocale[locale] });
  }
}

for (const [id, byLocale] of Object.entries(events)) {
  for (const locale of LOCALES) {
    const v = byLocale[locale];
    rows.push({ entity_type: "event", entity_id: id, locale, field: "title", value: v.title });
    rows.push({ entity_type: "event", entity_id: id, locale, field: "description", value: v.description });
    rows.push({ entity_type: "event", entity_id: id, locale, field: "location", value: v.location });
    rows.push({ entity_type: "event", entity_id: id, locale, field: "content", value: v.content });
  }
}

async function main() {
  console.log(`Upserting ${rows.length} translation rows...`);
  const { error } = await supabase
    .from("translations")
    .upsert(rows, { onConflict: "entity_type,entity_id,locale,field" });
  if (error) {
    console.error("Upsert error:", error);
    process.exit(1);
  }
  console.log("Done.");
}

main();
