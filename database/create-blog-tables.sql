-- Blog System Tables for Glad Tidings Medical Missionary Website
-- Created for PostgreSQL (Neon)

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image VARCHAR(500),
    author_name VARCHAR(100),
    author_email VARCHAR(255),
    published BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    read_time INTEGER DEFAULT 5, -- in minutes
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Post Categories Junction Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS post_categories (
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_post_categories_post ON post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_category ON post_categories(category_id);

-- Create Updated At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert Default Categories
INSERT INTO categories (name, slug, description) VALUES
('Health Tips', 'health-tips', 'Practical health advice and tips for daily wellness'),
('Natural Remedies', 'natural-remedies', 'Traditional and natural healing methods'),
('Medical Missionary', 'medical-missionary', 'Stories and insights from medical missionary work'),
('Spiritual Wellness', 'spiritual-wellness', 'Connecting physical health with spiritual wellbeing'),
('Prevention', 'prevention', 'Disease prevention and healthy lifestyle practices'),
('Nutrition', 'nutrition', 'Nutritional advice and healthy eating habits')
ON CONFLICT (slug) DO NOTHING;

-- Create a view for published posts with categories
CREATE OR REPLACE VIEW published_posts AS
SELECT 
    p.id,
    p.title,
    p.slug,
    p.content,
    p.excerpt,
    p.cover_image,
    p.author_name,
    p.author_email,
    p.published,
    p.featured,
    p.read_time,
    p.meta_title,
    p.meta_description,
    p.created_at,
    p.updated_at,
    p.published_at,
    ARRAY_AGG(c.name) as categories,
    ARRAY_AGG(c.slug) as category_slugs
FROM posts p
LEFT JOIN post_categories pc ON p.id = pc.post_id
LEFT JOIN categories c ON pc.category_id = c.id
WHERE p.published = TRUE
GROUP BY p.id, p.title, p.slug, p.content, p.excerpt, p.cover_image, 
         p.author_name, p.author_email, p.published, p.featured, 
         p.read_time, p.meta_title, p.meta_description, 
         p.created_at, p.updated_at, p.published_at
ORDER BY p.published_at DESC;
