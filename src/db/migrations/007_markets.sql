-- Multi-market support
-- Each market is a separate business entity with its own content (news, events),
-- leads, and CTA links. Tools/categories/tags remain shared globally.

-- 1. Markets table
CREATE TABLE IF NOT EXISTS markets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  locale TEXT NOT NULL,
  cta_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO markets (id, name, locale) VALUES
  ('cn', 'Malaysia Chinese', 'cn'),
  ('my', 'Malaysia Malay', 'my'),
  ('tw', 'Taiwan', 'tw')
ON CONFLICT (id) DO NOTHING;

-- 2. Add market_id to market-scoped tables
ALTER TABLE posts ADD COLUMN IF NOT EXISTS market_id TEXT REFERENCES markets(id) DEFAULT 'cn';
ALTER TABLE events ADD COLUMN IF NOT EXISTS market_id TEXT REFERENCES markets(id) DEFAULT 'cn';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS market_id TEXT REFERENCES markets(id) DEFAULT 'cn';

CREATE INDEX IF NOT EXISTS idx_posts_market ON posts(market_id);
CREATE INDEX IF NOT EXISTS idx_events_market ON events(market_id);
CREATE INDEX IF NOT EXISTS idx_leads_market ON leads(market_id);

-- 3. Migrate locale codes in translations table
UPDATE translations SET locale = 'cn' WHERE locale = 'zh-MY';
UPDATE translations SET locale = 'my' WHERE locale = 'ms';
UPDATE translations SET locale = 'tw' WHERE locale = 'zh-TW';
DELETE FROM translations WHERE locale = 'en';

-- 4. Migrate locale codes in leads table
UPDATE leads SET locale = 'cn' WHERE locale = 'zh-MY';
UPDATE leads SET locale = 'my' WHERE locale = 'ms';
UPDATE leads SET locale = 'tw' WHERE locale = 'zh-TW';
UPDATE leads SET locale = 'cn' WHERE locale = 'en';
