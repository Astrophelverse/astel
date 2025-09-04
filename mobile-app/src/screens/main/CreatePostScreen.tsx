import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { postService } from "@/services/PostService";
import { storageService } from "@/services/StorageService";
import { authService } from "@/services/AuthService";

const CreatePostScreen = () => {
  const [modelName, setModelName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [condition, setCondition] = useState<"new" | "london_use" | "second_hand">("new");
  const [stockQty, setStockQty] = useState("1");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [photoUrls, setPhotoUrls] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!modelName || !price || !stockQty) {
        Alert.alert("Missing fields", "Model, price and stock are required");
        return;
      }
      const user = authService.getCurrentUser();
      if (!user) {
        Alert.alert("Not logged in", "Please sign in to post");
        return;
      }

      const photos = photoUrls
        .split(/\s|,/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);

      storageService.enforceProductMediaLimits(
        photos,
        videoUrl ? { url: videoUrl, durationSec: Number(videoDuration) || 0 } : undefined
      );

      const post = await postService.createPost({
        author_id: user.uid,
        post_type: "product",
        content: {
          photos,
          video: videoUrl || undefined,
          video_duration: videoUrl ? Number(videoDuration) || 0 : undefined,
        },
        product_details: {
          model_name: modelName,
          price: Number(price),
          currency,
          condition,
          stock_quantity: Number(stockQty),
          category: "Smartphones",
          brand: "Generic",
        },
        location: { city, area },
        engagement: {
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
          saves_count: 0,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      Alert.alert("Posted", `Post ${post.id} created`);
      setModelName("");
      setPrice("");
      setStockQty("1");
      setCity("");
      setArea("");
      setPhotoUrls("");
      setVideoUrl("");
      setVideoDuration("");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Icon name="plus-circle" size={64} color="#C7C7CC" />
          <Text style={styles.title}>Create Product Post</Text>
          <Text style={styles.subtitle}>Paste media URLs for quick testing</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Model Name</Text>
          <TextInput
            style={styles.input}
            value={modelName}
            onChangeText={setModelName}
            placeholder="iPhone 13"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.rowItem]}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="500000"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, styles.rowItem]}>
            <Text style={styles.label}>Currency</Text>
            <TextInput
              style={styles.input}
              value={currency}
              onChangeText={setCurrency}
              placeholder="NGN"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.rowItem]}>
            <Text style={styles.label}>Condition</Text>
            <TextInput
              style={styles.input}
              value={condition}
              onChangeText={(v) => setCondition(v as any)}
              placeholder="new | london_use | second_hand"
            />
          </View>
          <View style={[styles.formGroup, styles.rowItem]}>
            <Text style={styles.label}>Stock Qty</Text>
            <TextInput
              style={styles.input}
              value={stockQty}
              onChangeText={setStockQty}
              placeholder="1"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.rowItem]}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Lagos"
            />
          </View>
          <View style={[styles.formGroup, styles.rowItem]}>
            <Text style={styles.label}>Area</Text>
            <TextInput
              style={styles.input}
              value={area}
              onChangeText={setArea}
              placeholder="Ikeja"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Photo URLs (comma or space separated, max 3)</Text>
          <TextInput
            style={styles.input}
            value={photoUrls}
            onChangeText={setPhotoUrls}
            placeholder="https://...jpg, https://...jpg"
          />
        </View>
        <View style={styles.row}>
          <View style={[styles.formGroup, styles.rowItem]}>
            <Text style={styles.label}>Video URL (optional)</Text>
            <TextInput
              style={styles.input}
              value={videoUrl}
              onChangeText={setVideoUrl}
              placeholder="https://...mp4"
            />
          </View>
          <View style={[styles.formGroup, styles.rowItem]}>
            <Text style={styles.label}>Video Duration (s)</Text>
            <TextInput
              style={styles.input}
              value={videoDuration}
              onChangeText={setVideoDuration}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitText}>{isSubmitting ? "Posting..." : "Post"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 },
  header: { alignItems: "center", marginBottom: 40 },
  title: { fontSize: 24, fontWeight: "700", color: "#000000", marginTop: 16, marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#8E8E93", textAlign: "center", lineHeight: 22 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: "#8E8E93", marginBottom: 6 },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  row: { flexDirection: "row", gap: 12 },
  rowItem: { flex: 1 },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});

export default CreatePostScreen;
