const { storage } = require("../../../firebase/config");
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export class StorageService {
  public static async uploadImage(uri: string, userId: string): Promise<string> {
    const fileExt = uri.split(".").pop() || "jpg";
    const path = `posts/${userId}/images/${Date.now()}.${fileExt}`;
    const storageRef = ref(storage, path);
    const blob = await StorageService.uriToBlob(uri);
    await uploadBytes(storageRef, blob, { contentType: `image/${fileExt}` });
    return getDownloadURL(storageRef);
  }

  public static async uploadVideo(uri: string, userId: string): Promise<string> {
    const fileExt = uri.split(".").pop() || "mp4";
    const path = `posts/${userId}/videos/${Date.now()}.${fileExt}`;
    const storageRef = ref(storage, path);
    const blob = await StorageService.uriToBlob(uri);
    await uploadBytes(storageRef, blob, { contentType: `video/${fileExt}` });
    return getDownloadURL(storageRef);
  }

  public static enforceProductMediaLimits(
    photos: string[],
    video?: { url: string; durationSec: number }
  ): void {
    if (photos.length > 3) {
      throw new Error("Max 3 photos allowed per product post");
    }
    if (video && video.durationSec > 30) {
      throw new Error("Product video must be 30s or less");
    }
  }

  public static enforceStoryMediaLimits(
    imagesCount: number,
    videosCount: number,
    maxVideoDurationSec: number
  ): void {
    if (imagesCount > 5) {
      throw new Error("Max 5 images allowed per story session");
    }
    if (videosCount > 3) {
      throw new Error("Max 3 videos allowed per story session");
    }
    if (maxVideoDurationSec > 15) {
      throw new Error("Story videos must be 15s or less (30s for premium)");
    }
  }

  private static async uriToBlob(uri: string): Promise<Blob> {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  }
}

export const storageService = StorageService;
