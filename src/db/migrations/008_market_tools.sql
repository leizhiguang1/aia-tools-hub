-- Make tools per-market.
-- Each market (cn / my / tw) gets its own copy of every tool, so admins in
-- each portal maintain their own list independently. Mirrors the per-market
-- pattern established for posts/events/leads in migration 007.
--
-- Seeding strategy: every existing tool row is assumed to be CN content.
-- We duplicate each CN tool into MY and TW rows, pulling name/description
-- from the `translations` table (populated by scripts/seed-translations.ts).
-- New IDs are deterministic suffixes (`${id}-my`, `${id}-tw`) so the
-- migration is idempotent.

-- 1. Add market_id column + index
ALTER TABLE tools ADD COLUMN IF NOT EXISTS market_id TEXT REFERENCES markets(id) DEFAULT 'cn';
CREATE INDEX IF NOT EXISTS idx_tools_market ON tools(market_id);

-- 2. Backfill existing rows — they become the CN market's tools
UPDATE tools SET market_id = 'cn' WHERE market_id IS NULL;

-- 3. Duplicate CN tools into MY rows, applying existing translations
INSERT INTO tools (
  id, name, description, url, icon, category_id, pricing,
  sort_order, is_published, vote_count, market_id, created_at, updated_at
)
SELECT
  t.id || '-my',
  COALESCE(tn_name.value, t.name),
  COALESCE(tn_desc.value, t.description),
  t.url,
  t.icon,
  t.category_id,
  t.pricing,
  t.sort_order,
  t.is_published,
  0,
  'my',
  t.created_at,
  t.updated_at
FROM tools t
LEFT JOIN translations tn_name
  ON tn_name.entity_type = 'tool'
  AND tn_name.entity_id = t.id
  AND tn_name.locale = 'my'
  AND tn_name.field = 'name'
LEFT JOIN translations tn_desc
  ON tn_desc.entity_type = 'tool'
  AND tn_desc.entity_id = t.id
  AND tn_desc.locale = 'my'
  AND tn_desc.field = 'description'
WHERE t.market_id = 'cn'
ON CONFLICT (id) DO NOTHING;

-- 4. Duplicate CN tools into TW rows
INSERT INTO tools (
  id, name, description, url, icon, category_id, pricing,
  sort_order, is_published, vote_count, market_id, created_at, updated_at
)
SELECT
  t.id || '-tw',
  COALESCE(tn_name.value, t.name),
  COALESCE(tn_desc.value, t.description),
  t.url,
  t.icon,
  t.category_id,
  t.pricing,
  t.sort_order,
  t.is_published,
  0,
  'tw',
  t.created_at,
  t.updated_at
FROM tools t
LEFT JOIN translations tn_name
  ON tn_name.entity_type = 'tool'
  AND tn_name.entity_id = t.id
  AND tn_name.locale = 'tw'
  AND tn_name.field = 'name'
LEFT JOIN translations tn_desc
  ON tn_desc.entity_type = 'tool'
  AND tn_desc.entity_id = t.id
  AND tn_desc.locale = 'tw'
  AND tn_desc.field = 'description'
WHERE t.market_id = 'cn'
ON CONFLICT (id) DO NOTHING;

-- 5. Replicate tool_tags for the new MY / TW rows
INSERT INTO tool_tags (tool_id, tag_id)
SELECT tt.tool_id || '-my', tt.tag_id
FROM tool_tags tt
JOIN tools t ON t.id = tt.tool_id AND t.market_id = 'cn'
ON CONFLICT DO NOTHING;

INSERT INTO tool_tags (tool_id, tag_id)
SELECT tt.tool_id || '-tw', tt.tag_id
FROM tool_tags tt
JOIN tools t ON t.id = tt.tool_id AND t.market_id = 'cn'
ON CONFLICT DO NOTHING;

-- 6. Tool translations are now dead data — each market row is native.
--    Category and tag translations remain (those entities stay global).
DELETE FROM translations WHERE entity_type = 'tool';
