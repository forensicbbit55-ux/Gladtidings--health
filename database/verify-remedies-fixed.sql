-- Updated SQL to verify remedies table with correct column names
-- Run this in Neon Dashboard to verify data

-- 1. Check table structure
\d remedies

-- 2. Count total remedies
SELECT COUNT(*) as total_remedies FROM remedies;

-- 3. Show recent remedies (last 5 inserted) - CORRECTED
SELECT 
    id,
    title,
    slug,
    category_id,  -- Changed from category to category_id
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

-- 6. Sample full remedy data with correct column names
SELECT 
    id,
    title,
    slug,
    LEFT(description, 100) as description_preview,
    category_id,  -- Changed from category to category_id
    LEFT(image_url, 50) as image_preview,
    created_at
FROM remedies 
ORDER BY created_at DESC 
LIMIT 3;

-- 7. Test insert with correct column names
INSERT INTO remedies (
    title, 
    slug, 
    description, 
    ingredients, 
    benefits, 
    preparation, 
    category_id,  -- Changed from category to category_id
    image_url
) VALUES (
    'Test Remedy',
    'test-remedy',
    'This is a test remedy',
    'Test ingredients',
    'Test benefits',
    'Test preparation',
    'Herbal Remedies',  -- Changed from category to category_id
    'https://example.com/image.jpg'
);

-- 8. Verify the test insert
SELECT * FROM remedies WHERE slug = 'test-remedy';
