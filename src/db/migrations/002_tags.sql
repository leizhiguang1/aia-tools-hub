-- Tags table (shared across tools, events, posts)
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name_zh TEXT NOT NULL,
  name_en TEXT DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Junction tables
CREATE TABLE IF NOT EXISTS tool_tags (
  tool_id TEXT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, tag_id)
);

CREATE TABLE IF NOT EXISTS event_tags (
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, tag_id)
);

CREATE TABLE IF NOT EXISTS post_tags (
  post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
