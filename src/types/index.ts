export type Locale = "zh" | "en";

export interface Category {
  id: string;
  name_zh: string;
  name_en: string;
  slug: string;
  sort_order: number;
  created_at: number;
}

export interface Tool {
  id: string;
  name: string;
  description_zh: string;
  description_en: string;
  url: string;
  icon: string;
  category_id: string;
  sort_order: number;
  // joined from tag tables
  tag_list?: Tag[];
  is_published: number;
  created_at: number;
  updated_at: number;
  // joined fields
  category_name_zh?: string;
  category_name_en?: string;
  category_slug?: string;
}

export interface Event {
  id: string;
  title_zh: string;
  title_en: string;
  description_zh: string;
  description_en: string;
  content_zh: string;
  content_en: string;
  cover_image: string;
  date_start: string;
  date_end: string;
  location: string;
  external_url: string;
  is_published: number;
  created_at: number;
  updated_at: number;
  // joined from tag tables
  tag_list?: Tag[];
}

export interface Post {
  id: string;
  title_zh: string;
  title_en: string;
  slug: string;
  content_zh: string;
  content_en: string;
  excerpt_zh: string;
  excerpt_en: string;
  cover_image: string;
  author: string;
  is_published: number;
  published_at: number;
  created_at: number;
  updated_at: number;
  // joined from tag tables
  tag_list?: Tag[];
}

export interface Tag {
  id: string;
  name_zh: string;
  name_en: string;
  slug: string;
  color: string;
  sort_order: number;
  created_at: number;
}

export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  created_at: number;
}
