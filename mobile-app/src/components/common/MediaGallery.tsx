import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions, Text } from "react-native";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface MediaGalleryProps {
  photos: string[];
  video?: string;
  videoDuration?: number;
  style?: any;
  onMediaPress?: (index: number, type: "photo" | "video") => void;
  maxPhotos?: number;
}

const { width } = Dimensions.get("window");
const GALLERY_WIDTH = width - 32; // Account for margins
const PHOTO_SIZE = GALLERY_WIDTH / 3 - 4; // 3 columns with gap

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  photos,
  video,
  videoDuration,
  style,
  onMediaPress,
  maxPhotos = 3,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const allMedia = [
    ...photos.slice(0, maxPhotos).map((photo) => ({ type: "photo" as const, url: photo })),
    ...(video ? [{ type: "video" as const, url: video, duration: videoDuration }] : []),
  ];

  const handleMediaPress = (index: number, type: "photo" | "video") => {
    setActiveIndex(index);
    if (onMediaPress) {
      onMediaPress(index, type);
    }
  };

  const renderMediaItem = (item: any, index: number) => {
    const isActive = index === activeIndex;

    if (item.type === "video") {
      return (
        <TouchableOpacity
          key={`video-${index}`}
          style={[
            styles.mediaItem,
            styles.videoItem,
            { width: PHOTO_SIZE, height: PHOTO_SIZE },
            isActive && styles.activeItem,
          ]}
          onPress={() => handleMediaPress(index, "video")}
          activeOpacity={0.8}
        >
          <FastImage
            source={{ uri: item.url }}
            style={styles.mediaImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.videoOverlay}>
            <Icon name="play-circle" size={32} color="#FFFFFF" />
            {item.duration && (
              <Text style={styles.videoDuration}>{Math.floor(item.duration)}s</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={`photo-${index}`}
        style={[
          styles.mediaItem,
          { width: PHOTO_SIZE, height: PHOTO_SIZE },
          isActive && styles.activeItem,
        ]}
        onPress={() => handleMediaPress(index, "photo")}
        activeOpacity={0.8}
      >
        <FastImage
          source={{ uri: item.url }}
          style={styles.mediaImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    );
  };

  const renderGridLayout = () => {
    if (allMedia.length === 0) {
      return (
        <View style={[styles.placeholder, { width: GALLERY_WIDTH, height: PHOTO_SIZE }]}>
          <Icon name="image-outline" size={48} color="#C7C7CC" />
          <Text style={styles.placeholderText}>No media</Text>
        </View>
      );
    }

    if (allMedia.length === 1) {
      // Single media - full width
      const item = allMedia[0];
      return <View style={styles.singleMediaContainer}>{renderMediaItem(item, 0)}</View>;
    }

    if (allMedia.length === 2) {
      // Two media - side by side
      return (
        <View style={styles.twoMediaContainer}>
          {allMedia.map((item, index) => renderMediaItem(item, index))}
        </View>
      );
    }

    // Three or more media - grid layout
    return (
      <View style={styles.gridContainer}>
        {allMedia.slice(0, 3).map((item, index) => renderMediaItem(item, index))}
        {allMedia.length > 3 && (
          <View
            style={[
              styles.mediaItem,
              styles.moreMediaItem,
              { width: PHOTO_SIZE, height: PHOTO_SIZE },
            ]}
          >
            <View style={styles.moreMediaOverlay}>
              <Text style={styles.moreMediaText}>+{allMedia.length - 3}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderGridLayout()}

      {/* Media Indicators */}
      {allMedia.length > 1 && (
        <View style={styles.indicators}>
          {allMedia.map((_, index) => (
            <View
              key={index}
              style={[styles.indicator, index === activeIndex && styles.activeIndicator]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  singleMediaContainer: {
    width: GALLERY_WIDTH,
    height: PHOTO_SIZE * 2,
  },
  twoMediaContainer: {
    flexDirection: "row",
    gap: 4,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  mediaItem: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F2F2F7",
  },
  videoItem: {
    position: "relative",
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  activeItem: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoDuration: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  moreMediaItem: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  moreMediaOverlay: {
    justifyContent: "center",
    alignItems: "center",
  },
  moreMediaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  placeholder: {
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  placeholderText: {
    color: "#8E8E93",
    fontSize: 14,
    marginTop: 8,
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#C7C7CC",
  },
  activeIndicator: {
    backgroundColor: "#007AFF",
    width: 18,
  },
});
