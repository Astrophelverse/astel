import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface OnlineStatusProps {
  isOnline: boolean;
  lastSeen: string;
  size?: "small" | "medium" | "large";
}

export const OnlineStatus: React.FC<OnlineStatusProps> = ({
  isOnline,
  lastSeen,
  size = "medium",
}) => {
  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return { dot: 6, text: 10 };
      case "large":
        return { dot: 10, text: 14 };
      default:
        return { dot: 8, text: 12 };
    }
  };

  const formatLastSeen = (timestamp: string) => {
    const now = new Date();
    const lastSeenDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}m ago`;
  };

  const sizeConfig = getSizeConfig();

  if (isOnline) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.onlineDot,
            {
              width: sizeConfig.dot,
              height: sizeConfig.dot,
              borderRadius: sizeConfig.dot / 2,
            },
          ]}
        />
        <Text style={[styles.statusText, { fontSize: sizeConfig.text }]}>Online</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Icon name="clock-outline" size={sizeConfig.dot} color="#8E8E93" />
      <Text style={[styles.statusText, { fontSize: sizeConfig.text }]}>
        {formatLastSeen(lastSeen)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  onlineDot: {
    backgroundColor: "#34C759",
  },
  statusText: {
    color: "#8E8E93",
    fontWeight: "500",
  },
});
