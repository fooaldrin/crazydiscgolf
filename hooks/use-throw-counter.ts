import { useCallback, useState } from 'react';

/**
 * Hook to track throws and determine when to show video ads
 * 
 * @param throwThreshold - Number of throws before showing ad (default: 20)
 * @returns Object with throw count, shouldShowAd flag, increment and reset functions
 */
export function useThrowCounter(throwThreshold: number = 20) {
  const [throwCount, setThrowCount] = useState(0);
  const [shouldShowAd, setShouldShowAd] = useState(false);

  /**
   * Increment throw count and check if we should show ad
   */
  const incrementThrow = useCallback(() => {
    setThrowCount((prev) => {
      const newCount = prev + 1;
      
      console.log(`📊 Throw count: ${newCount}/${throwThreshold}`);
      
      // Check if we've reached the threshold
      if (newCount >= throwThreshold) {
        console.log('🚨 Throw threshold reached! Setting shouldShowAd to true');
        setShouldShowAd(true);
        return newCount; // Keep count for display purposes
      }
      
      return newCount;
    });
  }, [throwThreshold]);

  /**
   * Reset throw counter after showing ad
   */
  const resetCounter = useCallback(() => {
    setThrowCount(0);
    setShouldShowAd(false);
  }, []);

  /**
   * Get throws remaining until next ad
   */
  const throwsUntilAd = Math.max(0, throwThreshold - throwCount);

  return {
    throwCount,
    shouldShowAd,
    throwsUntilAd,
    incrementThrow,
    resetCounter,
  };
}
