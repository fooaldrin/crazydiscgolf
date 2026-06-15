import { Platform } from "react-native";

const TEST_IDS = {
  BANNER: "ca-app-pub-3940256099942544/6300978111",
  INTERSTITIAL: "ca-app-pub-3940256099942544/1033173712",
};

/**
 * Production AdMob Ad Unit IDs (real, from the AdMob console).
 * Android has no app/ad units yet, so it falls back to test IDs.
 */
const PROD_IDS = {
  ios: {
    BANNER: "ca-app-pub-2649396512295570/1197980952",
    INTERSTITIAL: "ca-app-pub-2649396512295570/5797864651",
  },
};

/**
 * Google AdMob Configuration
 *
 * Development (__DEV__) always uses Google's test IDs to avoid policy issues.
 * Production builds use the real Ad Unit IDs above. Env vars can override.
 */

export const AdMobConfig = {
  // Banner Ad Unit IDs
  bannerAdId: Platform.select({
    ios:
      process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_IOS ||
      (__DEV__ ? TEST_IDS.BANNER : PROD_IDS.ios.BANNER),
    android: process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID || TEST_IDS.BANNER,
  }) as string,

  // Interstitial Video Ad Unit IDs
  interstitialAdId: Platform.select({
    ios:
      process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_IOS ||
      (__DEV__ ? TEST_IDS.INTERSTITIAL : PROD_IDS.ios.INTERSTITIAL),
    android:
      process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID ||
      TEST_IDS.INTERSTITIAL,
  }) as string,
};

/**
 * Ad Display Settings
 */
export const AdSettings = {
  // Show video ad after this many throws
  throwsPerVideoAd: 20,

  // Enable test mode (shows test ads)
  enableTestMode: __DEV__, // Automatically true in development
};

/**
 * Hook to access AdMob configuration
 */
export function useAdMobConfig() {
  return {
    bannerAdId: AdMobConfig.bannerAdId,
    interstitialAdId: AdMobConfig.interstitialAdId,
    settings: AdSettings,
  };
}
