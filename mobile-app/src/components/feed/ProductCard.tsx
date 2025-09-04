import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";

import { BadgeDisplay } from "../badges/BadgeDisplay";
import { OnlineStatus } from "../common/OnlineStatus";
import { PriceDisplay } from "../common/PriceDisplay";
import { MediaGallery } from "../common/MediaGallery";

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

interface ProductCardProps {
  product: Product;
  onLike: (productId: string) => void;
  onComment: (productId: string) => void;
  onShare: (productId: string) => void;
  onSave: (productId: string) => void;
  onProductPress: (product: Product) => void;
  onSellerPress: (sellerId: string) => void;
  isLiked?: boolean;
  isSaved?: boolean;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = 400;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onLike,
  onComment,
  onShare,
  onSave,
  onProductPress,
  onSellerPress,
  isLiked = false,
  isSaved = false,
}) => {
  const [likeAnim] = useState(new Animated.Value(1));
  const [saveAnim] = useState(new Animated.Value(1));

  const handleLike = () => {
    Animated.sequence([
      Animated.timing(likeAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onLike(product.id);
  };

  const handleSave = () => {
    Animated.sequence([
      Animated.timing(saveAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(saveAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onSave(product.id);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "#34C759";
      case "london_use":
        return "#007AFF";
      case "second_hand":
        return "#FF9500";
      default:
        return "#8E8E93";
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case "new":
        return "NEW";
      case "london_use":
        return "LONDON USE";
      case "second_hand":
        return "SECOND HAND";
      default:
        return "UNKNOWN";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}m ago`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onProductPress(product)}
      activeOpacity={0.95}
    >
      {/* Sponsored Badge */}
      {product.isSponsored && (
        <View style={styles.sponsoredBadge}>
          <LinearGradient colors={["#FF9500", "#FF6B35"]} style={styles.sponsoredGradient}>
            <Text style={styles.sponsoredText}>SPONSORED</Text>
          </LinearGradient>
        </View>
      )}

      {/* Media Gallery */}
      <MediaGallery
        photos={product.media.photos}
        video={product.media.video}
        videoDuration={product.media.video_duration}
        style={styles.mediaContainer}
      />

      {/* Product Info */}
      <View style={styles.productInfo}>
        {/* Model Name and Condition */}
        <View style={styles.headerRow}>
          <Text style={styles.modelName} numberOfLines={1}>
            {product.model_name}
          </Text>
          <View
            style={[
              styles.conditionBadge,
              { backgroundColor: getConditionColor(product.condition) },
            ]}
          >
            <Text style={styles.conditionText}>{getConditionLabel(product.condition)}</Text>
          </View>
        </View>

        {/* Price and Stock */}
        <View style={styles.priceRow}>
          <PriceDisplay price={product.price} currency={product.currency} size="large" />
          <View style={styles.stockInfo}>
            <Icon name="package-variant" size={16} color="#8E8E93" />
            <Text style={styles.stockText}>{product.stock_quantity} in stock</Text>
          </View>
        </View>

        {/* Seller Info */}
        <TouchableOpacity
          style={styles.sellerRow}
          onPress={() => onSellerPress(product.seller.id)}
          activeOpacity={0.7}
        >
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName} numberOfLines={1}>
              {product.seller.name}
            </Text>
            <BadgeDisplay badges={product.seller.badges} size="small" showTooltip={false} />
          </View>
          <View style={styles.sellerStatus}>
            <OnlineStatus
              isOnline={product.seller.online_status.is_online}
              lastSeen={product.seller.online_status.last_seen}
              size="small"
            />
          </View>
        </TouchableOpacity>

        {/* Location */}
        <View style={styles.locationRow}>
          <Icon name="map-marker" size={16} color="#8E8E93" />
          <Text style={styles.locationText} numberOfLines={1}>
            {product.location.city}, {product.location.area}
          </Text>
        </View>

        {/* Engagement Actions */}
        <View style={styles.engagementRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike} activeOpacity={0.7}>
            <Animated.View style={{ transform: [{ scale: likeAnim }] }}>
              <Icon
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? "#FF3B30" : "#8E8E93"}
              />
            </Animated.View>
            <Text style={[styles.actionText, isLiked ? styles.liked : styles.neutral]}>
              {product.engagement.likes_count}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onComment(product.id)}
            activeOpacity={0.7}
          >
            <Icon name="comment-outline" size={24} color="#8E8E93" />
            <Text style={styles.actionText}>{product.engagement.comments_count}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onShare(product.id)}
            activeOpacity={0.7}
          >
            <Icon name="share-variant-outline" size={24} color="#8E8E93" />
            <Text style={styles.actionText}>{product.engagement.shares_count}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleSave} activeOpacity={0.7}>
            <Animated.View style={{ transform: [{ scale: saveAnim }] }}>
              <Icon
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={24}
                color={isSaved ? "#007AFF" : "#8E8E93"}
              />
            </Animated.View>
            <Text style={[styles.actionText, isSaved ? styles.saved : styles.neutral]}>
              {product.engagement.saves_count}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Timestamp */}
        <Text style={styles.timestamp}>{formatTimeAgo(product.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  sponsoredBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 10,
  },
  sponsoredGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sponsoredText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  mediaContainer: {
    height: 240,
    width: "100%",
  },
  productInfo: {
    padding: 16,
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  modelName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    flex: 1,
    marginRight: 8,
  },
  conditionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  conditionText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stockInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stockText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  sellerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  sellerStatus: {
    alignItems: "flex-end",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  engagementRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  liked: {
    color: "#FF3B30",
  },
  saved: {
    color: "#007AFF",
  },
  neutral: {
    color: "#8E8E93",
  },
  timestamp: {
    fontSize: 10,
    color: "#C7C7CC",
    textAlign: "center",
    marginTop: 8,
  },
});
