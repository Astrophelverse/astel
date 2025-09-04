export interface Ad {
  id: string;
  advertiser_id: string;
  title: string;
  description: string;
  media: {
    photos?: string[];
    video?: string;
  };
  target_audience: string[];
  budget: number;
  currency: string;
  status: "active" | "paused" | "completed";
  impressions: number;
  clicks: number;
  created_at: string;
  expires_at: string;
}

class AdService {
  private static instance: AdService;

  public static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  public async getAds(userId: string, isPremium: boolean): Promise<Ad[]> {
    try {
      // Mock ads - replace with actual API call
      if (isPremium) {
        return []; // Premium users see no ads
      }

      // Mock ads for free users
      return [
        {
          id: "ad1",
          advertiser_id: "seller1",
          title: "Premium iPhone 15 Pro",
          description: "Get the latest iPhone at great prices!",
          media: {
            photos: ["https://via.placeholder.com/400x300?text=Ad+1"],
          },
          target_audience: ["buyers", "tech_enthusiasts"],
          budget: 50000,
          currency: "NGN",
          status: "active",
          impressions: 1250,
          clicks: 45,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    } catch (error) {
      console.error("Error fetching ads:", error);
      return [];
    }
  }

  public async trackImpression(adId: string): Promise<void> {
    try {
      // Mock impression tracking
      console.log("Ad impression tracked:", adId);
      // Replace with actual API call: POST /api/ads/{adId}/impression
    } catch (error) {
      console.error("Error tracking impression:", error);
    }
  }

  public async trackClick(adId: string): Promise<void> {
    try {
      // Mock click tracking
      console.log("Ad click tracked:", adId);
      // Replace with actual API call: POST /api/ads/{adId}/click
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  }
}

export const adService = AdService.getInstance();
export { AdService };
