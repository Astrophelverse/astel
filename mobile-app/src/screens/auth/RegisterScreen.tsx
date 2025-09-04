import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { authService } from "../../services/AuthService";

const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "buyer" as "buyer" | "seller" | "both",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.displayName || !formData.username || !formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await authService.register(formData.email.trim(), formData.password, {
        display_name: formData.displayName,
        username: formData.username,
        account_type: formData.accountType,
      } as any);
      Alert.alert("Success", "Account created successfully!");
      // App will pick up stored user and route
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient colors={["#007AFF", "#5856D6"]} style={styles.logoContainer}>
            <Icon name="phone" size={60} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the ASTEL marketplace community</Text>
        </View>

        {/* Registration Form */}
        <View style={styles.formContainer}>
          {/* Display Name */}
          <View style={styles.inputContainer}>
            <Icon name="account-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#8E8E93"
              value={formData.displayName}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, displayName: text }))}
              autoCapitalize="words"
            />
          </View>

          {/* Username */}
          <View style={styles.inputContainer}>
            <Icon name="at" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#8E8E93"
              value={formData.username}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, username: text }))}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Icon name="email-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#8E8E93"
              value={formData.email}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Icon name="lock-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#8E8E93"
              value={formData.password}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Icon name="lock-check-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#8E8E93"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, confirmPassword: text }))}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Account Type */}
          <View style={styles.accountTypeContainer}>
            <Text style={styles.accountTypeLabel}>Account Type:</Text>
            <View style={styles.accountTypeButtons}>
              {(["buyer", "seller", "both"] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.accountTypeButton,
                    formData.accountType === type && styles.accountTypeButtonActive,
                  ]}
                  onPress={() => setFormData((prev) => ({ ...prev, accountType: type }))}
                >
                  <Text
                    style={[
                      styles.accountTypeButtonText,
                      formData.accountType === type && styles.accountTypeButtonTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  accountTypeContainer: {
    marginBottom: 24,
  },
  accountTypeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  accountTypeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  accountTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    alignItems: "center",
  },
  accountTypeButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  accountTypeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  accountTypeButtonTextActive: {
    color: "#FFFFFF",
  },
  registerButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
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
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  footerText: {
    color: "#8E8E93",
    fontSize: 16,
  },
  footerLink: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RegisterScreen;
