import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

// Import screens
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import GuestScreen from "./src/screens/auth/GuestScreen";
import ProductsTab from "./src/screens/main/ProductsTab";
import FollowTab from "./src/screens/main/FollowTab";
import LearnTab from "./src/screens/main/LearnTab";
import ExploreTab from "./src/screens/main/ExploreTab";
import ProfileScreen from "./src/screens/main/ProfileScreen";
import CreatePostScreen from "./src/screens/main/CreatePostScreen";
import PostDetailScreen from "./src/screens/main/PostDetailScreen";
import ChatScreen from "./src/screens/main/ChatScreen";
import ConversationsScreen from "./src/screens/main/ConversationsScreen";

// Import components
import { TabBarIcon } from "./src/components/common/TabBarIcon";
import { LoadingScreen } from "./src/components/common/LoadingScreen";

// Import services
import { AuthService } from "./src/services/AuthService";
import { ThemeService } from "./src/services/ThemeService";

// Import types
import { User, Theme } from "./src/types";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tab Navigator
const MainTabNavigator = () => {
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
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Products" component={ProductsTab} options={{ title: "Products" }} />
      <Tab.Screen name="Follow" component={FollowTab} options={{ title: "Follow" }} />
      <Tab.Screen name="Learn" component={LearnTab} options={{ title: "Learn" }} />
      <Tab.Screen name="Explore" component={ExploreTab} options={{ title: "Explore" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFFFFF",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#000000",
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ title: "Create Post" }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: "Post Details" }}
      />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "Chat" }} />
      <Stack.Screen
        name="Conversations"
        component={ConversationsScreen}
        options={{ title: "Messages" }}
      />
    </Stack.Navigator>
  );
};

// Auth Stack Navigator
const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFFFFF",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#000000",
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Create Account" }}
      />
      <Stack.Screen name="Guest" component={GuestScreen} options={{ title: "Continue as Guest" }} />
    </Stack.Navigator>
  );
};

// Main App Component
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>("light");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize theme
      const savedTheme = await ThemeService.getTheme();
      setTheme(savedTheme);

      // Check for existing user session
      const savedUser = await AuthService.getStoredUser();
      if (savedUser && savedUser.token) {
        // Validate token
        const isValid = await AuthService.validateToken(savedUser.token);
        if (isValid) {
          setUser(savedUser);
        } else {
          // Clear invalid token
          await AuthService.clearStoredUser();
        }
      }

      setIsInitialized(true);
    } catch (error) {
      console.error("App initialization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={[styles.container, theme === "light" ? styles.bgLight : styles.bgDark]}>
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
        backgroundColor={theme === "light" ? "#FFFFFF" : "#000000"}
      />

      <NavigationContainer
        theme={{
          dark: theme === "dark",
          colors: {
            primary: "#007AFF",
            background: theme === "light" ? "#FFFFFF" : "#000000",
            card: theme === "light" ? "#FFFFFF" : "#1C1C1E",
            text: theme === "light" ? "#000000" : "#FFFFFF",
            border: theme === "light" ? "#E5E5EA" : "#38383A",
            notification: "#FF3B30",
          },
        }}
      >
        {user ? <MainStackNavigator /> : <AuthStackNavigator />}
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgLight: {
    backgroundColor: "#FFFFFF",
  },
  bgDark: {
    backgroundColor: "#000000",
  },
});

export default App;
