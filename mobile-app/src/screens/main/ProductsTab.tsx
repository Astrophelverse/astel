import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { ProductCard } from "../../components/feed/ProductCard";
import { StoryRing } from "../../components/stories/StoryRing";
import { CreatePostButton } from "../../components/common/CreatePostButton";
import { postService } from "../../services/PostService";

interface Product {
  id: string;
  model_name: string;
  price: number;
  currency: string;
  condition: "new" | "london_use" | "second_hand";
  stock_quantity: number;
  seller: {
    id: string;
    name: string;
    badges: any[];
    online_status: {
      is_online: boolean;
      last_seen: string;
    };
  };
  media: {
    photos: string[];
    video?: string;
    video_duration?: number;
  };
  location: {
    city: string;
    area: string;
  };
  engagement: {
    likes_count: number;
    comments_count: number;
    shares_count: number;
    saves_count: number;
  };
  created_at: string;
  isSponsored?: boolean;
}

const ProductsTab = () => {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<Product[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  // Load initial data
  useEffect(() => {
    loadProducts();
    loadStories();
  }, []);

  const loadProducts = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setPage(1);
        setHasMore(true);
      }

      const response = await postService.getFeed("products", pageNum);

      if (refresh) {
        setProducts(response.posts as unknown as Product[]);
      } else {
        setProducts((prev) => [...prev, ...(response.posts as unknown as Product[])]);
      }

      setHasMore(response.hasMore);
      setPage(pageNum + 1);
    } catch (error) {
      console.error("Error loading products:", error);
      Alert.alert("Error", "Failed to load products");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadStories = async () => {
    try {
      const storiesData = await postService.getStories();
      setStories(storiesData);
    } catch (error) {
      console.error("Error loading stories:", error);
    }
  };

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadProducts(1, true);
    loadStories();
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      loadProducts(page);
    }
  }, [hasMore, page, isLoading]);

  const handleLike = async (productId: string) => {
    try {
      const isLiked = likedPosts.has(productId);
      if (isLiked) {
        await postService.unlikePost(productId);
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        await postService.likePost(productId);
        setLikedPosts((prev) => new Set(prev).add(productId));
      }
    } catch (error) {
      console.error("Error handling like:", error);
      Alert.alert("Error", "Failed to update like");
    }
  };

  const handleComment = (productId: string) => {
    navigation.navigate("PostDetail", { postId: productId, showComments: true });
  };

  const handleShare = async (productId: string) => {
    try {
      await postService.sharePost(productId);
      Alert.alert("Success", "Post shared successfully");
    } catch (error) {
      console.error("Error sharing post:", error);
      Alert.alert("Error", "Failed to share post");
    }
  };

  const handleSave = async (productId: string) => {
    try {
      const isSaved = savedPosts.has(productId);
      if (isSaved) {
        await postService.unsavePost(productId);
        setSavedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        await postService.savePost(productId);
        setSavedPosts((prev) => new Set(prev).add(productId));
      }
    } catch (error) {
      console.error("Error handling save:", error);
      Alert.alert("Error", "Failed to update save");
    }
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate("PostDetail", { postId: product.id });
  };

  const handleSellerPress = (sellerId: string) => {
    navigation.navigate("Profile", { userId: sellerId });
  };

  const handleCreatePost = () => {
    navigation.navigate("CreatePost");
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onLike={handleLike}
      onComment={handleComment}
      onShare={handleShare}
      onSave={handleSave}
      onProductPress={handleProductPress}
      onSellerPress={handleSellerPress}
      isLiked={likedPosts.has(item.id)}
      isSaved={savedPosts.has(item.id)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Stories Ring */}
      <StoryRing
        stories={stories}
        onStoryPress={(storyId) => {
          // Handle story press
          console.log("Story pressed:", storyId);
        }}
      />

      {/* Welcome Message */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Discover Amazing Products</Text>
        <Text style={styles.welcomeSubtitle}>
          Find the best phones and gadgets from trusted sellers
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>No more products to load</Text>
        </View>
      );
    }

    if (isLoading) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    return null;
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="package-variant" size={64} color="#C7C7CC" />
      <Text style={styles.emptyTitle}>No Products Yet</Text>
      <Text style={styles.emptySubtitle}>Be the first to post a product or check back later</Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleCreatePost}>
        <Text style={styles.emptyButtonText}>Post Your First Product</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading amazing products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Create Post Button */}
      <CreatePostButton onPress={handleCreatePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8E8E93",
  },
  listContainer: {
    paddingBottom: 100, // Space for create post button
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 16,
  },
  welcomeContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 48,
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#8E8E93",
  },
});

export default ProductsTab;
