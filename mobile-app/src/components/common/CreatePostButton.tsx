import React, { useRef } from "react";
import { TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface CreatePostButtonProps {
  onPress: () => void;
  size?: "small" | "medium" | "large";
  position?: "bottom-right" | "bottom-center" | "bottom-left";
}

const { width } = Dimensions.get("window");

export const CreatePostButton: React.FC<CreatePostButtonProps> = ({
  onPress,
  size = "medium",
  position = "bottom-right",
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return { button: 48, icon: 20 };
      case "large":
        return { button: 72, icon: 32 };
      default:
        return { button: 56, icon: 24 };
    }
  };

  const getPositionStyle = () => {
    switch (position) {
      case "bottom-center":
        return {
          bottom: 100,
          left: width / 2 - getSizeConfig().button / 2,
        };
      case "bottom-left":
        return {
          bottom: 100,
          left: 24,
        };
      default: // bottom-right
        return {
          bottom: 100,
          right: 24,
        };
    }
  };

  const sizeConfig = getSizeConfig();
  const positionStyle = getPositionStyle();

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    // Add a small delay for the animation to complete
    setTimeout(() => {
      onPress();
    }, 100);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: sizeConfig.button,
          height: sizeConfig.button,
          transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
          ...positionStyle,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={["#007AFF", "#5856D6"]}
          style={[
            styles.gradient,
            {
              width: sizeConfig.button,
              height: sizeConfig.button,
              borderRadius: sizeConfig.button / 2,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon name="plus" size={sizeConfig.icon} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1000,
  },
  button: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
