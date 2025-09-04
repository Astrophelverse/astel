import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface LoadingScreenProps {
  message?: string;
  showLogo?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  showLogo = true,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#007AFF", "#5856D6"]} style={styles.background}>
        {showLogo && (
          <View style={styles.logoContainer}>
            <Icon name="phone" size={80} color="#FFFFFF" />
            <Text style={styles.appName}>ASTEL</Text>
            <Text style={styles.appTagline}>Marketplace</Text>
          </View>
        )}

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>{message}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  appName: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 16,
    letterSpacing: 2,
  },
  appTagline: {
    fontSize: 18,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 4,
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 16,
    opacity: 0.9,
  },
});
