import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ProfileScreen = () => (
  <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Icon name="account" size={64} color="#C7C7CC" />
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Your account and settings</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>Profile features coming soon!</Text>
      </View>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 },
  header: { alignItems: "center", marginBottom: 40 },
  title: { fontSize: 24, fontWeight: "700", color: "#000000", marginTop: 16, marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#8E8E93", textAlign: "center", lineHeight: 22 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  message: { fontSize: 16, color: "#8E8E93", textAlign: "center", lineHeight: 22 },
});

export default ProfileScreen;
