-- Market CTA QR caching.
-- Store a pre-rendered base64 PNG on the market row so stack-builder can
-- embed it inline (no external fetch during html-to-image capture).
-- Regenerated only when cta_url changes via the admin market-settings action.
ALTER TABLE markets ADD COLUMN IF NOT EXISTS qr_data_url TEXT DEFAULT '';
