/**
 * Interface representing an article from Pepper.pl
 */
export interface Article {
  link: string;
  title: string;
  price: string;
  shippingPrice: string;
  description: string;
  image: string;
}

/**
 * Interface for categorized article from Supabase
 */
export interface CategorizedArticle {
  article_id: string;
  title: string;
  description: string;
  price: string;
  shipping_price: string;
  image: string;
  link: string;
  category: string;
  created_at: string;
} 