import AsyncStorage from "@react-native-async-storage/async-storage";
const { auth, db } = require("../../../firebase/config");
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  token: string;
  profile: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  username: string;
  account_type: "buyer" | "seller" | "both";
  verification: {
    email_verified: boolean;
    verified_seller: boolean;
  };
  subscription: {
    astel_plus: boolean;
  };
  badges: any[];
  online_status: {
    is_online: boolean;
    last_seen: string;
  };
  created_at: string;
  updated_at: string;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = cred.user;
    const token = await fbUser.getIdToken();

    const profile = await this.ensureUserProfile(fbUser.uid, {
      email: fbUser.email || email,
      displayName: fbUser.displayName || email.split("@")[0],
    });

    const user: User = {
      uid: fbUser.uid,
      email: fbUser.email || email,
      displayName: fbUser.displayName || undefined,
      photoURL: fbUser.photoURL || undefined,
      token,
      profile,
    };

    this.currentUser = user;
    await this.storeUser(user);
    return user;
  }

  public async register(
    email: string,
    password: string,
    data: Partial<UserProfile>
  ): Promise<User> {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = cred.user;
    const token = await fbUser.getIdToken();

    const profile = await this.createInitialProfile(fbUser.uid, {
      email,
      displayName: data.display_name || email.split("@")[0],
      account_type: (data.account_type as any) || "buyer",
    });

    const user: User = {
      uid: fbUser.uid,
      email: email,
      displayName: profile.display_name,
      token,
      profile,
    };

    this.currentUser = user;
    await this.storeUser(user);
    return user;
  }

  public async signInWithGoogleIdToken(idToken: string): Promise<User> {
    const credential = GoogleAuthProvider.credential(idToken);
    const cred = await signInWithCredential(auth, credential);
    const fbUser = cred.user;
    const token = await fbUser.getIdToken();

    const profile = await this.ensureUserProfile(fbUser.uid, {
      email: fbUser.email || "",
      displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split("@")[0] : "user"),
    });

    const user: User = {
      uid: fbUser.uid,
      email: fbUser.email || "",
      displayName: fbUser.displayName || undefined,
      photoURL: fbUser.photoURL || undefined,
      token,
      profile,
    };

    this.currentUser = user;
    await this.storeUser(user);
    return user;
  }

  public async signOut(): Promise<void> {
    await fbSignOut(auth);
    this.currentUser = null;
    await this.clearStoredUser();
  }

  private async ensureUserProfile(
    uid: string,
    seed: { email: string; displayName: string }
  ): Promise<UserProfile> {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return this.createInitialProfile(uid, seed);
  }

  private async createInitialProfile(
    uid: string,
    seed: { email: string; displayName: string; account_type?: "buyer" | "seller" | "both" }
  ): Promise<UserProfile> {
    const profile: UserProfile = {
      id: uid,
      user_id: uid,
      display_name: seed.displayName,
      username: seed.displayName.toLowerCase().replace(/\s+/g, ""),
      account_type: seed.account_type || "buyer",
      verification: { email_verified: true, verified_seller: false },
      subscription: { astel_plus: false },
      badges: [],
      online_status: { is_online: true, last_seen: new Date().toISOString() },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", uid), {
      ...profile,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return profile;
  }

  public async validateToken(token: string): Promise<boolean> {
    return !!token;
  }

  public async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem("@astel_user", JSON.stringify(user));
    } catch {}
  }

  public async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem("@astel_user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  public async clearStoredUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem("@astel_user");
    } catch {}
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  public isGuest(): boolean {
    return this.currentUser?.uid.startsWith("guest_") || false;
  }

  public isPremium(): boolean {
    return this.currentUser?.profile.subscription.astel_plus || false;
  }

  public isSeller(): boolean {
    return (
      this.currentUser?.profile.account_type === "seller" ||
      this.currentUser?.profile.account_type === "both"
    );
  }
}

export const authService = AuthService.getInstance();
export { AuthService };
