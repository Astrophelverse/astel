import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const GuestScreen = () => {
  const navigation = useNavigation<any>();

  const handleGuestAccess = () => {
    Alert.alert(
      "Guest Access",
      "You can browse products and view content as a guest. Some features will be limited.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue as Guest",
          onPress: () => {
            // Navigate to main app with guest user
            console.log("Guest access granted");
            // This would typically set a guest user in the app state
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#007AFF", "#5856D6"]} style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="account-outline" size={80} color="#FFFFFF" />
          <Text style={styles.title}>Guest Access</Text>
          <Text style={styles.subtitle}>Explore ASTEL marketplace without creating an account</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Icon name="eye" size={24} color="#FFFFFF" />
            <Text style={styles.featureText}>Browse products</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="magnify" size={24} color="#FFFFFF" />
            <Text style={styles.featureText}>Search and filter</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="heart-outline" size={24} color="#FFFFFF" />
            <Text style={styles.featureText}>View content</Text>
          </View>
        </View>

        {/* Limitations */}
        <View style={styles.limitationsContainer}>
          <Text style={styles.limitationsTitle}>Limited Features:</Text>
          <Text style={styles.limitationText}>• Cannot post products</Text>
          <Text style={styles.limitationText}>• Cannot send messages</Text>
          <Text style={styles.limitationText}>• Cannot save favorites</Text>
          <Text style={styles.limitationText}>• Cannot follow users</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestAccess}
            activeOpacity={0.8}
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.8}
          >
            <Text style={styles.signUpButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.8}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.9,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 12,
    opacity: 0.9,
  },
  limitationsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 40,
  },
  limitationsTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  limitationText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 6,
    opacity: 0.8,
  },
  actionsContainer: {
    gap: 16,
  },
  guestButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  guestButtonText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "600",
  },
  signUpButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signInButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default GuestScreen;
