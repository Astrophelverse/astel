import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";

interface Story {
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
  isViewed?: boolean;
}

interface StoryRingProps {
  stories: Story[];
  onStoryPress: (storyId: string) => void;
  onAddStory?: () => void;
  showAddButton?: boolean;
}

const STORY_SIZE = 64;
const STORY_RING_WIDTH = 4;
const STORY_SPACING = 12;

export const StoryRing: React.FC<StoryRingProps> = ({
  stories,
  onStoryPress,
  onAddStory,
  showAddButton = false,
}) => {
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());

  const handleStoryPress = (storyId: string) => {
    setViewedStories((prev) => new Set(prev).add(storyId));
    onStoryPress(storyId);
  };

  const getStoryRingColor = (story: Story) => {
    if (viewedStories.has(story.id)) {
      return ["#E5E5EA", "#C7C7CC"]; // Viewed - gray
    }

    // Unviewed - gradient based on content type
    switch (story.content_type) {
      case "photo":
        return ["#FF9500", "#FF6B35"]; // Orange
      case "video":
        return ["#007AFF", "#5856D6"]; // Blue
      case "text":
        return ["#34C759", "#30D158"]; // Green
      case "mixed":
        return ["#AF52DE", "#8E44AD"]; // Purple
      default:
        return ["#007AFF", "#5856D6"]; // Default blue
    }
  };

  const getStoryIcon = (story: Story) => {
    switch (story.content_type) {
      case "photo":
        return "image";
      case "video":
        return "video";
      case "text":
        return "text";
      case "mixed":
        return "layers";
      default:
        return "circle";
    }
  };

  const getStoryThumbnail = (story: Story): string | undefined => {
    if (story.media.photos && story.media.photos.length > 0) {
      return story.media.photos[0];
    }
    if (story.media.video) {
      return story.media.video;
    }
    return undefined;
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

  const isStoryExpired = (story: Story) => {
    const now = new Date();
    const expiresAt = new Date(story.expires_at);
    return now > expiresAt;
  };

  // Filter out expired stories
  const activeStories = stories.filter((story) => !isStoryExpired(story));

  if (activeStories.length === 0 && !showAddButton) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Add Story Button */}
        {showAddButton && (
          <TouchableOpacity style={styles.storyItem} onPress={onAddStory} activeOpacity={0.8}>
            <View style={styles.addStoryContainer}>
              <LinearGradient colors={["#007AFF", "#5856D6"]} style={styles.addStoryGradient}>
                <Icon name="plus" size={24} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.storyAuthorName} numberOfLines={1}>
              Add Story
            </Text>
          </TouchableOpacity>
        )}

        {/* Story Items */}
        {activeStories.map((story, _index) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyItem}
            onPress={() => handleStoryPress(story.id)}
            activeOpacity={0.8}
          >
            {/* Story Ring */}
            <View style={styles.storyRingContainer}>
              <LinearGradient
                colors={getStoryRingColor(story)}
                style={styles.storyRing}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Story Content */}
                <View style={styles.storyContent}>
                  {getStoryThumbnail(story) ? (
                    <FastImage
                      source={{ uri: getStoryThumbnail(story) }}
                      style={styles.storyThumbnail}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  ) : (
                    <View style={styles.storyPlaceholder}>
                      <Icon name={getStoryIcon(story)} size={24} color="#8E8E93" />
                    </View>
                  )}

                  {/* Content Type Indicator */}
                  {story.content_type === "mixed" && (
                    <View style={styles.mixedIndicator}>
                      <Icon name="layers" size={12} color="#FFFFFF" />
                    </View>
                  )}

                  {/* Video Indicator */}
                  {story.content_type === "video" && (
                    <View style={styles.videoIndicator}>
                      <Icon name="play" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </View>
              </LinearGradient>
            </View>

            {/* Author Name */}
            <Text style={styles.storyAuthorName} numberOfLines={1}>
              {story.author.name}
            </Text>

            {/* Time Ago */}
            <Text style={styles.storyTime} numberOfLines={1}>
              {formatTimeAgo(story.created_at)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  storyItem: {
    alignItems: "center",
    marginRight: STORY_SPACING,
    width: STORY_SIZE + 20, // Extra width for text
  },
  storyRingContainer: {
    marginBottom: 8,
  },
  storyRing: {
    width: STORY_SIZE + STORY_RING_WIDTH * 2,
    height: STORY_SIZE + STORY_RING_WIDTH * 2,
    borderRadius: (STORY_SIZE + STORY_RING_WIDTH * 2) / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storyContent: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  storyThumbnail: {
    width: "100%",
    height: "100%",
  },
  storyPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  mixedIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#AF52DE",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  videoIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addStoryContainer: {
    marginBottom: 8,
  },
  addStoryGradient: {
    width: STORY_SIZE + STORY_RING_WIDTH * 2,
    height: STORY_SIZE + STORY_RING_WIDTH * 2,
    borderRadius: (STORY_SIZE + STORY_RING_WIDTH * 2) / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  storyAuthorName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    marginBottom: 2,
  },
  storyTime: {
    fontSize: 10,
    color: "#8E8E93",
    textAlign: "center",
  },
});
