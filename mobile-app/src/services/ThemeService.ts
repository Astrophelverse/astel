import AsyncStorage from "@react-native-async-storage/async-storage";

export type Theme = "light" | "dark" | "system";

class ThemeService {
  private static instance: ThemeService;
  private readonly THEME_KEY = "@astel_theme";

  public static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  public async getTheme(): Promise<Theme> {
    try {
      const savedTheme = await AsyncStorage.getItem(this.THEME_KEY);
      return (savedTheme as Theme) || "system";
    } catch (error) {
      console.error("Error getting theme:", error);
      return "system";
    }
  }

  public async setTheme(theme: Theme): Promise<void> {
    try {
      await AsyncStorage.setItem(this.THEME_KEY, theme);
    } catch (error) {
      console.error("Error setting theme:", error);
    }
  }

  public async clearTheme(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.THEME_KEY);
    } catch (error) {
      console.error("Error clearing theme:", error);
    }
  }

  public getThemeColors(theme: Theme) {
    const isDark = theme === "dark" || (theme === "system" && this.isSystemDark());

    if (isDark) {
      return {
        primary: "#007AFF",
        background: "#000000",
        card: "#1C1C1E",
        text: "#FFFFFF",
        border: "#38383A",
        notification: "#FF3B30",
        secondaryText: "#8E8E93",
        tertiaryText: "#C7C7CC",
        success: "#34C759",
        warning: "#FF9500",
        error: "#FF3B30",
        info: "#007AFF",
      };
    } else {
      return {
        primary: "#007AFF",
        background: "#FFFFFF",
        card: "#FFFFFF",
        text: "#000000",
        border: "#E5E5EA",
        notification: "#FF3B30",
        secondaryText: "#8E8E93",
        tertiaryText: "#C7C7CC",
        success: "#34C759",
        warning: "#FF9500",
        error: "#FF3B30",
        info: "#007AFF",
      };
    }
  }

  private isSystemDark(): boolean {
    // This would check the system theme
    // For now, default to light
    return false;
  }
}

export const themeService = ThemeService.getInstance();
export { ThemeService };
