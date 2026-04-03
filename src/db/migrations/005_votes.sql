-- Add vote count directly to tools for fast reads
ALTER TABLE tools ADD COLUMN vote_count INTEGER NOT NULL DEFAULT 0;

-- Lightweight vote log for deduplication
CREATE TABLE IF NOT EXISTS votes (
  id TEXT PRIMARY KEY,
  tool_id TEXT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  voter_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Prevent same fingerprint voting on same tool twice
CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_tool_voter ON votes(tool_id, voter_hash);

-- For cleanup jobs: delete old vote records
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);
