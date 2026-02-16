/**
 * Blog type definitions for the wellness blog system
 */

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string | null;
  author: string;
  image_url: string | null;
  published_at: string;
}

export interface CreateBlogRequest {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  category?: string;
  author?: string;
  image_url?: string;
}

export interface BlogResponse {
  success: boolean;
  data?: Blog | Blog[];
  error?: string;
  message?: string;
}

export interface BlogListResponse {
  success: boolean;
  data: Blog[];
  pagination?: {
    limit?: number;
    offset?: number;
    total?: number;
  };
  error?: string;
}
