# Blogs API Usage Guide

Complete REST API for managing wellness blog posts and articles in your wellness platform.

## 🛠 API Endpoints

### Base URL
```
https://your-app.vercel.app/api/blogs
```

## 📋 Blog Post Schema

```typescript
interface Blog {
  id: number;
  title: string;
  slug: string;           // URL-friendly identifier
  content: string;        // Full blog content (HTML supported)
  excerpt: string | null;  // Brief description
  category: string | null; // e.g., "wellness-tips", "herbal-remedies"
  author: string;          // Defaults to "Glad Tidings Team"
  image_url: string | null;
  published_at: string;    // ISO timestamp
}
```

## 🔗 Endpoints

### 1. Get All Blog Posts
**GET** `/api/blogs`

#### Query Parameters (Optional)
- `category` - Filter by category (e.g., "wellness-tips", "herbal-remedies")
- `limit` - Number of results (default: 20, max: 100)
- `offset` - Pagination offset (default: 0)

#### Examples
```javascript
// Get all blog posts
fetch('/api/blogs')

// Get posts from specific category
fetch('/api/blogs?category=wellness-tips')

// Get 10 posts with pagination
fetch('/api/blogs?limit=10&offset=20')
```

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "10 Natural Ways to Boost Your Immune System",
      "slug": "10-natural-ways-to-boost-immune-system",
      "content": "<p>Full blog content here...</p>",
      "excerpt": "Discover natural methods to strengthen your immune system...",
      "category": "wellness-tips",
      "author": "Glad Tidings Team",
      "image_url": "https://example.com/immune-boost.jpg",
      "published_at": "2024-02-16T22:45:00.000Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0
  }
}
```

### 2. Get Single Blog Post
**GET** `/api/blogs/[slug]`

#### Example
```javascript
fetch('/api/blogs/10-natural-ways-to-boost-immune-system')
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "10 Natural Ways to Boost Your Immune System",
    "slug": "10-natural-ways-to-boost-immune-system",
    "content": "<p>Full blog content here...</p>",
    "excerpt": "Discover natural methods to strengthen your immune system...",
    "category": "wellness-tips",
    "author": "Glad Tidings Team",
    "image_url": "https://example.com/immune-boost.jpg",
    "published_at": "2024-02-16T22:45:00.000Z"
  }
}
```

### 3. Create Blog Post (Admin)
**POST** `/api/blogs`

#### Request Body
```json
{
  "title": "The Benefits of Herbal Medicine",
  "slug": "benefits-herbal-medicine", // optional - auto-generated if missing
  "content": "<p>Herbal medicine has been used for centuries...</p>",
  "excerpt": "Learn about the amazing benefits of herbal medicine", // optional
  "category": "herbal-remedies", // optional
  "author": "Dr. Sarah Johnson", // optional, defaults to "Glad Tidings Team"
  "image_url": "https://example.com/herbal-medicine.jpg" // optional
}
```

#### Example
```javascript
const newBlog = {
  title: "The Benefits of Herbal Medicine",
  content: "<p>Herbal medicine has been used for centuries...</p>",
  category: "herbal-remedies",
  author: "Dr. Sarah Johnson",
  image_url: "https://example.com/herbal-medicine.jpg"
};

fetch('/api/blogs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newBlog)
})
.then(response => response.json())
.then(data => console.log(data));
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "The Benefits of Herbal Medicine",
    "slug": "benefits-herbal-medicine",
    "content": "<p>Herbal medicine has been used for centuries...</p>",
    "excerpt": "Learn about the amazing benefits of herbal medicine",
    "category": "herbal-remedies",
    "author": "Dr. Sarah Johnson",
    "image_url": "https://example.com/herbal-medicine.jpg",
    "published_at": "2024-02-16T22:50:00.000Z"
  },
  "message": "Blog post created successfully"
}
```

### 4. Update Blog Post (Admin)
**PUT** `/api/blogs/[slug]`

#### Request Body (Partial Update)
```json
{
  "title": "Updated: The Benefits of Herbal Medicine",
  "content": "<p>Updated content about herbal medicine...</p>",
  "category": "natural-health"
}
```

#### Example
```javascript
const updates = {
  title: "Updated: The Benefits of Herbal Medicine",
  category: "natural-health"
};

fetch('/api/blogs/benefits-herbal-medicine', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updates)
})
.then(response => response.json())
.then(data => console.log(data));
```

### 5. Delete Blog Post (Admin)
**DELETE** `/api/blogs/[slug]`

#### Example
```javascript
fetch('/api/blogs/benefits-herbal-medicine', {
  method: 'DELETE'
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🎯 Frontend Integration Examples

### Blog List Component
```typescript
import { useState, useEffect } from 'react';
import { Blog } from '@/types/blog';

export function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async (category?: string) => {
    try {
      setLoading(true);
      const url = category 
        ? `/api/blogs?category=${encodeURIComponent(category)}`
        : '/api/blogs';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading blog posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Wellness Blog</h2>
      {blogs.map(blog => (
        <article key={blog.id} className="blog-post">
          <h3>
            <a href={`/blog/${blog.slug}`}>{blog.title}</a>
          </h3>
          {blog.image_url && (
            <img 
              src={blog.image_url} 
              alt={blog.title}
              className="blog-image"
            />
          )}
          <p className="blog-excerpt">{blog.excerpt}</p>
          <div className="blog-meta">
            <span>By {blog.author}</span>
            <span>{new Date(blog.published_at).toLocaleDateString()}</span>
            {blog.category && (
              <span className="category">{blog.category}</span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
```

### Single Blog Post Component
```typescript
import { useState, useEffect } from 'react';
import { Blog } from '@/types/blog';

interface BlogPostProps {
  slug: string;
}

export function BlogPost({ slug }: BlogPostProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setBlog(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch blog post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading blog post...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!blog) return <div>Blog post not found</div>;

  return (
    <article className="blog-post-full">
      <header>
        <h1>{blog.title}</h1>
        <div className="blog-meta">
          <span>By {blog.author}</span>
          <span>{new Date(blog.published_at).toLocaleDateString()}</span>
          {blog.category && (
            <span className="category">{blog.category}</span>
          )}
        </div>
      </header>
      
      {blog.image_url && (
        <img 
          src={blog.image_url} 
          alt={blog.title}
          className="blog-hero-image"
        />
      )}
      
      <div 
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
}
```

### Custom Hook for Blogs
```typescript
import { useState, useEffect } from 'react';
import { Blog } from '@/types/blog';

export function useBlogs(category?: string) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const url = category 
          ? `/api/blogs?category=${encodeURIComponent(category)}`
          : '/api/blogs';
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setBlogs(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [category]);

  return { blogs, loading, error };
}

export function useBlog(slug: string) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs/${slug}`);
        const data = await response.json();
        
        if (data.success) {
          setBlog(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch blog post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  return { blog, loading, error };
}
```

## 🚨 Error Handling

### Unique Slug Constraint
The API automatically handles unique slug constraints:

```json
{
  "success": false,
  "error": "A blog post with this slug already exists. Please try a different title or provide a custom slug."
}
```

### Auto Slug Generation
- Slugs are automatically generated from titles
- If a slug conflict exists, a number is appended (e.g., "my-post-2")
- You can provide a custom slug to override auto-generation

### Common HTTP Status Codes
- `200` - Success
- `201` - Created (POST)
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate slug)
- `500` - Internal Server Error

## 📝 Testing Examples

### Test with curl
```bash
# Get all blog posts
curl https://your-app.vercel.app/api/blogs

# Get posts by category
curl "https://your-app.vercel.app/api/blogs?category=wellness-tips"

# Get single blog post
curl https://your-app.vercel.app/api/blogs/10-natural-ways-to-boost-immune-system

# Create blog post
curl -X POST https://your-app.vercel.app/api/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Blog Post",
    "content": "This is a test blog post content.",
    "category": "test"
  }'
```

## 🎨 SEO Considerations

### URL Structure
- Blog posts use SEO-friendly URLs: `/blog/[slug]`
- Slugs are automatically generated from titles
- Categories can be used for filtering: `/blog/category/[category]`

### Meta Tags
```typescript
// Example Next.js page for blog post
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blogs/${params.slug}`);
  const data = await response.json();
  
  if (data.success) {
    return {
      title: data.data.title,
      description: data.data.excerpt,
      openGraph: {
        title: data.data.title,
        description: data.data.excerpt,
        images: data.data.image_url ? [data.data.image_url] : [],
      },
    };
  }
}
```

## 📅 Content Management

### Blog Categories
Suggested categories for wellness content:
- `wellness-tips` - General wellness advice
- `herbal-remedies` - Herbal medicine information
- `natural-health` - Natural health solutions
- `mindfulness` - Mental wellness and meditation
- `nutrition` - Health and nutrition tips
- `lifestyle` - Healthy lifestyle articles

### Content Guidelines
- Use semantic HTML in content (`<h2>`, `<h3>`, `<p>`, etc.)
- Include alt text for images
- Write compelling excerpts (auto-generated if not provided)
- Use consistent author attribution

Your blog API is now fully functional with automatic slug generation, unique constraint handling, and comprehensive frontend integration examples! 🎉
