-- Categories for tools
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name_zh TEXT NOT NULL,
  name_en TEXT DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- AI Tools directory
CREATE TABLE IF NOT EXISTS tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description_zh TEXT NOT NULL DEFAULT '',
  description_en TEXT DEFAULT '',
  url TEXT NOT NULL,
  icon TEXT DEFAULT '',
  category_id TEXT NOT NULL REFERENCES categories(id),
  tag_zh TEXT DEFAULT '',
  tag_en TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Events / Workshops / Courses
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title_zh TEXT NOT NULL,
  title_en TEXT DEFAULT '',
  description_zh TEXT NOT NULL DEFAULT '',
  description_en TEXT DEFAULT '',
  content_zh TEXT DEFAULT '',
  content_en TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  date_start TEXT NOT NULL,
  date_end TEXT,
  location TEXT DEFAULT '',
  tags TEXT DEFAULT '[]',
  external_url TEXT DEFAULT '',
  is_published INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- News / Blog posts
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title_zh TEXT NOT NULL,
  title_en TEXT DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  content_zh TEXT NOT NULL DEFAULT '',
  content_en TEXT DEFAULT '',
  excerpt_zh TEXT DEFAULT '',
  excerpt_en TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  tags TEXT DEFAULT '[]',
  is_published INTEGER NOT NULL DEFAULT 1,
  published_at INTEGER NOT NULL DEFAULT (unixepoch()),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Admin users
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
