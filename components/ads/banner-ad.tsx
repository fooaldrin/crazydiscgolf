import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BannerAdSize, BannerAd as GoogleBannerAd } from 'react-native-google-mobile-ads';
import { useAdMobConfig } from '../../hooks/use-admob';

interface BannerAdProps {
  /**
   * Optional custom ad unit ID (defaults to config)
   */
  adUnitId?: string;
  
  /**
   * Called when ad fails to load
   */
  onError?: (error: Error) => void;
  
  /**
   * Called when ad loads successfully
   */
  onAdLoaded?: () => void;
}

/**
 * Banner Ad Component
 * 
 * Displays a banner ad at the bottom of the screen.
 * Automatically uses test IDs in development mode.
 */
export function BannerAd({ adUnitId, onError, onAdLoaded }: BannerAdProps) {
  const { bannerAdId } = useAdMobConfig();
  
  const handleAdFailedToLoad = (error: Error) => {
    console.warn('Banner ad failed to load:', error);
    onError?.(error);
  };

  return (
    <View style={styles.container}>
      <GoogleBannerAd
        unitId={adUnitId || bannerAdId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Set to false if you have consent
        }}
        onAdFailedToLoad={handleAdFailedToLoad}
        onAdLoaded={onAdLoaded}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        // Add safe area padding for iOS
        paddingBottom: 0,
      },
      android: {
        paddingBottom: 0,
      },
    }),
  },
});

/**
 * Height of the banner ad (approximate)
 * Use this to add padding to your content to prevent overlap
 * Adaptive banners can be 50-90px tall depending on device
 */
export const BANNER_AD_HEIGHT = Platform.select({
  ios: 90, // Increased to account for adaptive banner height
  android: 90, // Increased to account for adaptive banner height
}) as number;
