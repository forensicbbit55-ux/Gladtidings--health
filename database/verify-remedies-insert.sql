-- SQL to verify remedies table and recent inserts
-- Run this in Neon Dashboard to verify data

-- 1. Check table structure
\d remedies

-- 2. Count total remedies
SELECT COUNT(*) as total_remedies FROM remedies;

-- 3. Show recent remedies (last 5 inserted)
SELECT 
    id,
    title,
    slug,
    category,
    created_at
FROM remedies 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Check for any missing columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'remedies' 
ORDER BY ordinal_position;

-- 5. Verify unique constraint on slug
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'remedies'::regclass AND contype = 'u';

-- 6. Sample full remedy data
SELECT 
    id,
    title,
    slug,
    LEFT(description, 100) as description_preview,
    category,
    LEFT(image_url, 50) as image_preview,
    created_at
FROM remedies 
ORDER BY created_at DESC 
LIMIT 3;
