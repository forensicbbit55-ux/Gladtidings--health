-- Add missing preparation column to remedies table
ALTER TABLE remedies ADD COLUMN IF NOT EXISTS preparation TEXT;

-- Also check if other columns are missing
ALTER TABLE remedies ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE remedies ADD COLUMN IF NOT EXISTS benefits TEXT;
ALTER TABLE remedies ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE remedies ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Create index on slug for better performance
CREATE INDEX IF NOT EXISTS idx_remedies_slug ON remedies(slug);
