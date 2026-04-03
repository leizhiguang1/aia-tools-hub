-- Drop old hardcoded tag fields (data now in junction tables)
ALTER TABLE tools DROP COLUMN tag_zh;
ALTER TABLE tools DROP COLUMN tag_en;
ALTER TABLE events DROP COLUMN tags;
ALTER TABLE posts DROP COLUMN tags;
