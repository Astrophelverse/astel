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

export interface FeedResponse {
  posts: Post[];
  hasMore: boolean;
  nextPage: number;
}

const { db } = require("../../../firebase/config");
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

class PostService {
  private static instance: PostService;
  private baseUrl = "http://localhost:5000/api"; // Replace with your actual API URL

  public static getInstance(): PostService {
    if (!PostService.instance) {
      PostService.instance = new PostService();
    }
    return PostService.instance;
  }

  public async getFeed(
    type: "products" | "tutorials" | "all",
    page: number = 1
  ): Promise<FeedResponse> {
    try {
      const pageSize = 10;
      const postsCol = collection(db, "posts");
      const filters = [] as any[];
      if (type !== "all") {
        filters.push(where("post_type", "==", type === "products" ? "product" : "tutorial"));
      }
      const q = query(postsCol, ...filters, orderBy("created_at", "desc"), limit(pageSize));
      const snap = await getDocs(q);
      const posts: Post[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      return {
        posts,
        hasMore: posts.length === pageSize,
        nextPage: page + 1,
      };
    } catch (error) {
      console.error("Error fetching feed:", error);
      throw new Error("Failed to fetch feed");
    }
  }

  public async getStories(): Promise<Story[]> {
    try {
      const storiesCol = collection(db, "stories");
      const q = query(storiesCol, orderBy("created_at", "desc"), limit(20));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    } catch (error) {
      console.error("Error fetching stories:", error);
      return [];
    }
  }

  public async likePost(postId: string): Promise<void> {
    try {
      // Mock API call
      console.log("Liked post:", postId);
      // Replace with actual API call: POST /api/posts/{postId}/like
    } catch (error) {
      console.error("Error liking post:", error);
      throw new Error("Failed to like post");
    }
  }

  public async unlikePost(postId: string): Promise<void> {
    try {
      // Mock API call
      console.log("Unliked post:", postId);
      // Replace with actual API call: DELETE /api/posts/{postId}/like
    } catch (error) {
      console.error("Error unliking post:", error);
      throw new Error("Failed to unlike post");
    }
  }

  public async savePost(postId: string): Promise<void> {
    try {
      // Mock API call
      console.log("Saved post:", postId);
      // Replace with actual API call: POST /api/posts/{postId}/save
    } catch (error) {
      console.error("Error saving post:", error);
      throw new Error("Failed to save post");
    }
  }

  public async unsavePost(postId: string): Promise<void> {
    try {
      // Mock API call
      console.log("Unsaved post:", postId);
      // Replace with actual API call: DELETE /api/posts/{postId}/save
    } catch (error) {
      console.error("Error unsaving post:", error);
      throw new Error("Failed to unsave post");
    }
  }

  public async sharePost(postId: string): Promise<void> {
    try {
      // Mock API call
      console.log("Shared post:", postId);
      // Replace with actual API call: POST /api/posts/{postId}/share
    } catch (error) {
      console.error("Error sharing post:", error);
      throw new Error("Failed to share post");
    }
  }

  public async createPost(postData: Partial<Post>): Promise<Post> {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        ...postData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        engagement: postData.engagement || {
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
          saves_count: 0,
        },
      } as any);
      const created: Post = { id: docRef.id, ...(postData as any) };
      return created;
    } catch (error) {
      console.error("Error creating post:", error);
      throw new Error("Failed to create post");
    }
  }

  public async createStory(storyData: Partial<Story>): Promise<Story> {
    try {
      const docRef = await addDoc(collection(db, "stories"), {
        ...storyData,
        created_at: serverTimestamp(),
        expires_at: storyData.expires_at || null,
      } as any);
      const created: Story = { id: docRef.id, ...(storyData as any) };
      return created;
    } catch (error) {
      console.error("Error creating story:", error);
      throw new Error("Failed to create story");
    }
  }

  private generateMockPosts(_type: string, _page: number): Post[] {
    return [];
  }
}

export const postService = PostService.getInstance();
export { PostService };
