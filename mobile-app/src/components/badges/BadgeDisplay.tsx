import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface Badge {
  type: "astel_plus" | "booster" | "early_supporter" | "verified_seller";
  level?: "bronze" | "silver" | "gold";
  tier?: number;
  isActive: boolean;
}

interface BadgeDisplayProps {
  badges: Badge[];
  size?: "small" | "medium" | "large";
  showTooltip?: boolean;
  onBadgePress?: (badge: Badge) => void;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badges,
  size = "medium",
  showTooltip = false,
  onBadgePress,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const getBadgeConfig = (badge: Badge) => {
    switch (badge.type) {
      case "astel_plus":
        return {
          icon: "crown",
          colors: getAstelPlusColors(badge.level),
          label: `Astel+ ${badge.level?.toUpperCase() || "BRONZE"}`,
        };
      case "booster":
        return {
          icon: "rocket-launch",
          colors: getBoosterColors(badge.tier),
          label: `Booster ${badge.tier || 1}`,
        };
      case "early_supporter":
        return {
          icon: "star",
          colors: ["#FFD700", "#FFA500"],
          label: "Early Supporter",
        };
      case "verified_seller":
        return {
          icon: "check-decagram",
          colors: ["#34C759", "#30D158"],
          label: "Verified Seller",
        };
      default:
        return {
          icon: "badge-account",
          colors: ["#8E8E93", "#AEAEB2"],
          label: "Badge",
        };
    }
  };

  const getAstelPlusColors = (level?: string) => {
    switch (level) {
      case "bronze":
        return ["#CD7F32", "#B8860B"];
      case "silver":
        return ["#C0C0C0", "#A8A8A8"];
      case "gold":
        return ["#FFD700", "#FFA500"];
      default:
        return ["#CD7F32", "#B8860B"];
    }
  };

  const getBoosterColors = (tier?: number) => {
    switch (tier) {
      case 1:
        return ["#34C759", "#30D158"];
      case 2:
        return ["#007AFF", "#5856D6"];
      case 3:
        return ["#FF9500", "#FF6B35"];
      case 4:
        return ["#FF3B30", "#FF2D55"];
      case 5:
        return ["#AF52DE", "#8E44AD"];
      default:
        return ["#34C759", "#30D158"];
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return { container: 24, icon: 12, text: 8 };
      case "medium":
        return { container: 32, icon: 16, text: 10 };
      case "large":
        return { container: 48, icon: 24, text: 14 };
      default:
        return { container: 32, icon: 16, text: 10 };
    }
  };

  const handleBadgePress = (badge: Badge) => {
    if (onBadgePress) {
      // Animate press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      onBadgePress(badge);
    }
  };

  const sizeConfig = getSizeConfig();

  if (!badges || badges.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {badges.map((badge, index) => {
        if (!badge.isActive) return null;

        const config = getBadgeConfig(badge);

        return (
          <TouchableOpacity
            key={`${badge.type}-${index}`}
            style={[
              styles.badgeContainer,
              { width: sizeConfig.container, height: sizeConfig.container },
            ]}
            onPress={() => handleBadgePress(badge)}
            activeOpacity={0.7}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <LinearGradient
                colors={config.colors}
                style={[
                  styles.badgeGradient,
                  { width: sizeConfig.container, height: sizeConfig.container },
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon
                  name={config.icon}
                  size={sizeConfig.icon}
                  color="#FFFFFF"
                  style={styles.badgeIcon}
                />
              </LinearGradient>
            </Animated.View>

            {showTooltip && (
              <View style={[styles.tooltip, { bottom: -sizeConfig.container - 5 }]}>
                <Text style={[styles.tooltipText, { fontSize: sizeConfig.text }]}>
                  {config.label}
                </Text>
                <View style={styles.tooltipArrow} />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeContainer: {
    position: "relative",
  },
  badgeGradient: {
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  badgeIcon: {
    textAlign: "center",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "#000000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "center",
    zIndex: 1000,
  },
  tooltipText: {
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
  },
  tooltipArrow: {
    position: "absolute",
    top: "100%",
    left: "50%",
    marginLeft: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#000000",
  },
});
