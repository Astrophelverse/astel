import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface TabBarIconProps {
  route: any;
  focused: boolean;
  color: string;
  size: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ route, focused, color, size }) => {
  const getIconName = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case "Products":
        return isFocused ? "shopping" : "shopping-outline";
      case "Follow":
        return isFocused ? "account-group" : "account-group-outline";
      case "Learn":
        return isFocused ? "school" : "school-outline";
      case "Explore":
        return isFocused ? "compass" : "compass-outline";
      case "Profile":
        return isFocused ? "account" : "account-outline";
      default:
        return "circle";
    }
  };

  return <Icon name={getIconName(route.name, focused)} size={size} color={color} />;
};
