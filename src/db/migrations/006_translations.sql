-- Translations table for multi-language content support
-- Chinese (zh) is the base language stored in main tables.
-- This table stores translations for other locales (en, ms, vi, etc.)

CREATE TABLE IF NOT EXISTS translations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  entity_type TEXT NOT NULL,  -- 'tool', 'event', 'post', 'category', 'tag'
  entity_id TEXT NOT NULL,
  locale TEXT NOT NULL,       -- 'en', 'ms', 'vi', etc.
  field TEXT NOT NULL,        -- 'name', 'description', 'title', 'content', 'excerpt'
  value TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(entity_type, entity_id, locale, field)
);

CREATE INDEX IF NOT EXISTS idx_translations_lookup
  ON translations(entity_type, entity_id, locale);
