import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ProductsTab from "../screens/main/ProductsTab";
import FollowTab from "../screens/main/FollowTab";
import LearnTab from "../screens/main/LearnTab";
import ExploreTab from "../screens/main/ExploreTab";
import ProfileScreen from "../screens/main/ProfileScreen";
import { TabBarIcon } from "../components/common/TabBarIcon";

export type BottomTabParamList = {
  Products: undefined;
  Follow: undefined;
  Learn: undefined;
  Explore: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon route={route} focused={focused} color={color} size={size} />
        ),
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Products"
        component={ProductsTab}
        options={{
          title: "Products",
        }}
      />
      <Tab.Screen
        name="Follow"
        component={FollowTab}
        options={{
          title: "Follow",
        }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnTab}
        options={{
          title: "Learn",
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreTab}
        options={{
          title: "Explore",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
