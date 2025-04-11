/**
 * API module for communicating with the backend
 */
import { z } from 'zod';
import { Article } from '@/app/types/article';

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Zod schema for Article type validation
const ArticleSchema = z.object({
  link: z.string(),
  title: z.string(),
  description: z.string().optional().default(''),
  price: z.string(),
  shippingPrice: z.string().optional().default(''),
  image: z.string().optional().default(''),
});

// Zod schema for CategorizedArticlesResponse
const CategorizedArticlesResponseSchema = z.object({
  categorizedArticles: z.record(z.array(ArticleSchema)),
  fromCache: z.boolean(),
  error: z.string().optional(),
});

// Type for API Response with categorized articles
export interface CategorizedArticlesResponse {
  categorizedArticles: Record<string, Article[]>;
  fromCache: boolean;
  error?: string;
}

/**
 * Fetch articles from Pepper.pl
 * @param page - Page number (default: 1)
 */
export async function fetchArticles(page: number = 1): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/articles?page=${page}`);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

/**
 * Fetch articles from multiple pages of Pepper.pl
 * @param pages - Number of pages to fetch (default: 3, max 10)
 */
export async function fetchMultiPageArticles(pages: number = 3): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/multi?pages=${pages}`);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching multi-page articles:', error);
    return [];
  }
}

/**
 * Fetch categorized articles directly from the cached endpoint
 * @param days - Number of days to fetch articles from (default: 14)
 */
export async function fetchCachedArticlesV2(
  days: number = 14,
): Promise<{
  categorizedArticles: Record<string, Article[]>;
  articles: Article[];
  fromCache: boolean;
  fromPepper: boolean;
  error?: string;
}> {
  try {
    
    const response = await fetch(
      `${API_BASE_URL}/articles/cached?days=${days}`,
      {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Default values in case some fields are missing in the response
    return {
      categorizedArticles: data.categorizedArticles || {},
      articles: data.articles || [],
      fromCache: data.fromCache || false,
      fromPepper: data.fromPepper || false,
      error: data.error
    };
  } catch (error) {
    console.error('Error fetching cached articles:', error);
    return {
      categorizedArticles: {},
      articles: [],
      fromCache: false,
      fromPepper: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Categorize articles using the backend
 * @param articles - Articles to categorize
 */
export async function categorizeArticles(articles: Article[]): Promise<CategorizedArticlesResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/categorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ articles })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate the response data
    const validatedData = CategorizedArticlesResponseSchema.parse(data);
    return validatedData;
  } catch (error) {
    console.error('Error categorizing articles:', error);
    return {
      categorizedArticles: {},
      fromCache: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch available categories
 */
export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categorize/categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch categorized articles from cache
 * @param days - Number of days to fetch (default: 7)
 * @param limit - Limit of results (default: 500)
 */
export async function fetchCachedArticles(days: number = 7, limit: number = 500): Promise<Record<string, Article[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/cache?days=${days}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.categorizedArticles || {};
  } catch (error) {
    console.error('Error fetching articles from cache:', error);
    return {};
  }
}

/**
 * Check Supabase connection
 */
export async function checkSupabaseConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/supabase/check`);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch cache statistics
 */
export async function fetchCacheStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/cache/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 