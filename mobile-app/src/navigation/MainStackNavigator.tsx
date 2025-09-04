import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import BottomTabNavigator from "./BottomTabNavigator";
import CreatePostScreen from "../screens/main/CreatePostScreen";
import PostDetailScreen from "../screens/main/PostDetailScreen";
import ChatScreen from "../screens/main/ChatScreen";
import ConversationsScreen from "../screens/main/ConversationsScreen";

export type MainStackParamList = {
  MainTabs: undefined;
  CreatePost: undefined;
  PostDetail: { postId: string; showComments?: boolean };
  Chat: { conversationId: string; otherUserId: string };
  Conversations: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Conversations" component={ConversationsScreen} />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
