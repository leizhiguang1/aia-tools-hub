-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- This creates all tables from scratch

-- Clean slate (drop if re-running)
DROP TABLE IF EXISTS tool_tags CASCADE;
DROP TABLE IF EXISTS event_tags CASCADE;
DROP TABLE IF EXISTS post_tags CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS tools CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS leads CASCADE;

-- Categories
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tools
CREATE TABLE tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  icon TEXT DEFAULT '',
  category_id TEXT NOT NULL REFERENCES categories(id),
  pricing TEXT NOT NULL DEFAULT 'freemium',
  vote_count INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tags
CREATE TABLE tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Junction: tool <-> tag
CREATE TABLE tool_tags (
  tool_id TEXT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, tag_id)
);

-- Votes (for dedup)
CREATE TABLE votes (
  id TEXT PRIMARY KEY,
  tool_id TEXT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  voter_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_votes_tool_voter ON votes(tool_id, voter_hash);

-- Events
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  date_start TEXT NOT NULL,
  date_end TEXT,
  location TEXT DEFAULT '',
  external_url TEXT DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE event_tags (
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, tag_id)
);

-- Posts
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE post_tags (
  post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- RPC: atomic vote increment
CREATE OR REPLACE FUNCTION increment_vote_count(tool_id_param TEXT)
RETURNS void AS $$
BEGIN
  UPDATE tools SET vote_count = vote_count + 1 WHERE id = tool_id_param;
END;
$$ LANGUAGE plpgsql;

-- Leads
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_locale ON leads(locale);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- Markets
CREATE TABLE markets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  locale TEXT NOT NULL,
  cta_url TEXT DEFAULT '',
  qr_data_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- market_id columns on scoped tables (posts, events, leads)
ALTER TABLE posts ADD COLUMN market_id TEXT REFERENCES markets(id) DEFAULT 'cn';
ALTER TABLE events ADD COLUMN market_id TEXT REFERENCES markets(id) DEFAULT 'cn';
ALTER TABLE leads ADD COLUMN market_id TEXT REFERENCES markets(id) DEFAULT 'cn';

CREATE INDEX IF NOT EXISTS idx_posts_market ON posts(market_id);
CREATE INDEX IF NOT EXISTS idx_events_market ON events(market_id);
CREATE INDEX IF NOT EXISTS idx_leads_market ON leads(market_id);
