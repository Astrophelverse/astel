export * from "../services/AuthService";
export * from "../services/PostService";
export * from "../services/ThemeService";

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  token: string;
  profile: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  username: string;
  account_type: "buyer" | "seller" | "both";
  verification: {
    email_verified: boolean;
    verified_seller: boolean;
  };
  subscription: {
    astel_plus: boolean;
  };
  badges: any[];
  online_status: {
    is_online: boolean;
    last_seen: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  post_type: "product" | "tutorial" | "story";
  content: {
    text?: string;
    photos?: string[];
    video?: string;
    video_duration?: number;
  };
  product_details?: {
    model_name: string;
    price: number;
    currency: string;
    condition: "new" | "london_use" | "second_hand";
    stock_quantity: number;
    category: string;
    brand: string;
  };
  location: {
    city: string;
    area: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  engagement: {
    likes_count: number;
    comments_count: number;
    shares_count: number;
    saves_count: number;
  };
  isSponsored?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  author: {
    id: string;
    name: string;
    profile_picture: string;
  };
  media: {
    photos?: string[];
    video?: string;
    text?: string;
  };
  content_type: "photo" | "video" | "text" | "mixed";
  created_at: string;
  expires_at: string;
}

export interface Badge {
  type: "astel_plus" | "booster" | "early_supporter" | "verified_seller";
  level?: "bronze" | "silver" | "gold";
  tier?: number;
  isActive: boolean;
  earned_date: string;
  expires_date?: string;
}

export type Theme = "light" | "dark" | "system";
