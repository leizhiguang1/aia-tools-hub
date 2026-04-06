export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category_id: string;
  pricing: "free" | "freemium" | "paid";
  vote_count: number;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // joined fields
  category_name?: string;
  category_slug?: string;
  // joined from tag tables
  tag_list?: Tag[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  content: string;
  cover_image: string;
  date_start: string;
  date_end: string;
  location: string;
  external_url: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  tag_list?: Tag[];
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  author: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  tag_list?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  sort_order: number;
  created_at: string;
}

export interface Translation {
  id: string;
  entity_type: string;
  entity_id: string;
  locale: string;
  field: string;
  value: string;
  created_at: string;
  updated_at: string;
}
