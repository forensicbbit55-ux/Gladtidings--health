-- Add price column to remedies table
ALTER TABLE remedies ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 0;

-- Add missing preparation column if it doesn't exist
ALTER TABLE remedies ADD COLUMN IF NOT EXISTS preparation TEXT;

-- Add missing slug column if it doesn't exist
ALTER TABLE remedies ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Add missing benefits column if it doesn't exist
ALTER TABLE remedies ADD COLUMN IF NOT EXISTS benefits TEXT;

-- Add unique constraint on slug if not exists
ALTER TABLE remedies ADD CONSTRAINT IF NOT EXISTS remedies_slug_unique UNIQUE (slug);

-- Update existing remedies with default values if needed
UPDATE remedies 
SET slug = 'remedy-' || id 
WHERE slug IS NULL OR slug = '';

-- Update existing remedies with sample prices if price is 0 or NULL
UPDATE remedies 
SET price = CASE 
  WHEN title ILIKE '%tea%' THEN 150.00
  WHEN title ILIKE '%oil%' THEN 250.00
  WHEN title ILIKE '%herb%' THEN 100.00
  WHEN title ILIKE '%tincture%' THEN 300.00
  WHEN title ILIKE '%salve%' THEN 200.00
  ELSE 120.00
END
WHERE price = 0 OR price IS NULL;
