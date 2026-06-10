import { useCallback, useEffect, useState } from 'react';
import {
    AdEventType,
    InterstitialAd,
} from 'react-native-google-mobile-ads';
import { useAdMobConfig } from '../../hooks/use-admob';

/**
 * Hook to manage interstitial video ads
 * 
 * @returns Object with functions to load and show video ads
 */
export function useInterstitialAd() {
  const { interstitialAdId } = useAdMobConfig();
  const [isAdReady, setIsAdReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [interstitial, setInterstitial] = useState<InterstitialAd | null>(null);

  /**
   * Initialize interstitial ad instance
   */
  useEffect(() => {
    console.log('🎬 Initializing interstitial ad with ID:', interstitialAdId);
    
    const ad = InterstitialAd.createForAdRequest(interstitialAdId, {
      requestNonPersonalizedAdsOnly: true, // Set to false if you have consent
    });

    setInterstitial(ad);

    // Load the ad immediately
    console.log('📥 Loading interstitial ad...');
    ad.load();
    setIsLoading(true);

    return () => {
      // Cleanup
      ad.removeAllListeners();
    };
  }, [interstitialAdId]);

  /**
   * Set up event listeners for interstitial ad
   */
  useEffect(() => {
    if (!interstitial) return;

    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('✅ Interstitial ad loaded successfully!');
      setIsAdReady(true);
      setIsLoading(false);
    });

    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.warn('❌ Interstitial ad failed to load:', error);
      setIsAdReady(false);
      setIsLoading(false);
      
      // Retry loading after 3 seconds
      console.log('🔄 Will retry loading ad in 3 seconds...');
      setTimeout(() => {
        console.log('🔄 Retrying ad load...');
        interstitial.load();
        setIsLoading(true);
      }, 3000);
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('🚪 Interstitial ad closed');
      setIsAdReady(false);
      // Preload next ad
      console.log('📥 Preloading next interstitial ad...');
      interstitial.load();
      setIsLoading(true);
    });

    return () => {
      unsubscribeLoaded();
      unsubscribeError();
      unsubscribeClosed();
    };
  }, [interstitial]);

  /**
   * Show the interstitial ad
   */
  const showAd = useCallback(async () => {
    if (!interstitial) {
      console.warn('Interstitial ad not initialized');
      return false;
    }

    if (!isAdReady) {
      console.warn('Interstitial ad not ready yet');
      // Try to load if not ready
      interstitial.load();
      setIsLoading(true);
      return false;
    }

    try {
      await interstitial.show();
      return true;
    } catch (error) {
      console.warn('Error showing interstitial ad:', error);
      setIsAdReady(false);
      return false;
    }
  }, [interstitial, isAdReady]);

  return {
    isAdReady,
    isLoading,
    showAd,
  };
}
