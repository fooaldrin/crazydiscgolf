import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

/**
 * Google AdMob Configuration
 * 
 * Test IDs provided by Google for development.
 * Replace with your real Ad Unit IDs for production.
 */

export const AdMobConfig = {
  // Banner Ad Unit IDs
  bannerAdId: Platform.select({
    ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_IOS || TestIds.BANNER,
    android: process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID || TestIds.BANNER,
  }) as string,

  // Interstitial Video Ad Unit IDs  
  interstitialAdId: Platform.select({
    ios: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_IOS || TestIds.INTERSTITIAL,
    android: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID || TestIds.INTERSTITIAL,
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
