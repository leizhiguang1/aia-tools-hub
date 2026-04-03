-- Add pricing column to tools table
ALTER TABLE tools ADD COLUMN pricing TEXT NOT NULL DEFAULT 'freemium';
