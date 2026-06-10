# AdMob Integration Status ✅

## What's Been Done

### ✅ Package Installation
- Installed `react-native-google-mobile-ads` (the current recommended solution)
- Old `expo-ads-admob` is deprecated - we're using the new package

### ✅ Configuration Files Created

#### 1. **hooks/use-admob.ts**
- Platform-specific Ad Unit ID configuration
- Uses test IDs automatically in development
- Environment variables for production IDs

#### 2. **hooks/use-throw-counter.ts**
- Tracks throws globally
- Triggers ad flag after 20 throws (configurable)
- Reset function for after showing ads

#### 3. **components/ads/banner-ad.tsx**
- Banner ad component for bottom of screen
- Auto-handles test mode
- Error handling built-in
- Exports BANNER_AD_HEIGHT constant (50px)

#### 4. **components/ads/interstitial-ad.tsx**
- useInterstitialAd() hook
- Auto-preloads ads in background
- Event handling for load/error/close
- Simple showAd() function

#### 5. **app.json**
- Added react-native-google-mobile-ads plugin
- Configured with test App IDs

### ✅ Test IDs Configured
The app is currently using Google's test IDs:
- Banner: `TestIds.BANNER`
- Interstitial: `TestIds.INTERSTITIAL`

These will automatically show test ads in development!

---

## Next Steps

### 1. Integrate Ads into Game Screen

You need to update `app/game/index.tsx` to use the ad components:

```tsx
import { BannerAd, useInterstitialAd, BANNER_AD_HEIGHT } from '@/components/ads';
import { useThrowCounter } from '@/hooks/use-throw-counter';

// In your component:
const { isAdReady, showAd } = useInterstitialAd();
const { throwCount, shouldShowAd, incrementThrow, resetCounter } = useThrowCounter(20);

// When player makes a throw:
const handleContinue = () => {
  // ... existing logic ...
  incrementThrow(); // Track the throw
  
  // Check if we should show video ad
  if (shouldShowAd && isAdReady) {
    showAd();
    resetCounter();
  }
};

// At the bottom of your screen JSX:
<BannerAd />
```

### 2. Add Bottom Padding to Game Content

To prevent the banner from covering your UI:

```tsx
<View style={[styles.container, { paddingBottom: BANNER_AD_HEIGHT + 10 }]}>
  {/* Your game content */}
</View>
```

### 3. Configure Production Ad Unit IDs (Before Publishing!)

When ready to publish:

1. Get your real Ad Unit IDs from AdMob console
2. Create a `.env` file in project root:

```env
EXPO_PUBLIC_ADMOB_BANNER_ID_IOS=ca-app-pub-XXXXXXXX~YYYYYY
EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID=ca-app-pub-XXXXXXXX~YYYYYY
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_IOS=ca-app-pub-XXXXXXXX~YYYYYY
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID=ca-app-pub-XXXXXXXX~YYYYYY
```

3. Update app.json with your real App IDs (replace the test ones)

---

## Testing

### Test in Development
- The app will automatically show test ads
- You'll see "Test Ad" watermark
- No real revenue generated

### Test Before Production
1. Build a development build: `npx expo run:ios` or `npx expo run:android`
2. Verify ads show at correct intervals
3. Test that game continues normally after ads
4. Verify banner doesn't cover important UI

---

## Important Notes

⚠️ **Do NOT use test IDs in production!**
- Your app will be rejected/banned from AdMob
- Always replace with real IDs before publishing

✅ **The throw counter tracks globally**
- Counts all throws from all players
- Resets after showing an ad
- Shows ad at natural breaks (after player finishes turn)

📱 **Banner Ad Positioning**
- Fixed at bottom of screen
- Uses ANCHORED_ADAPTIVE_BANNER (adjusts to screen width)
- Add padding to your content to prevent overlap

🎥 **Interstitial Video Ads**
- Auto-preloads in background
- Only shows when ready
- Shows after every 20 throws (configurable in use-admob.ts)

---

## Quick Integration Example

Here's what the integration looks like in your game screen:

```tsx
import { BannerAd, useInterstitialAd, BANNER_AD_HEIGHT } from '@/components/ads';
import { useThrowCounter } from '@/hooks/use-throw-counter';

export default function GameScreen() {
  const { isAdReady, showAd } = useInterstitialAd();
  const { shouldShowAd, incrementThrow, resetCounter } = useThrowCounter(20);

  const handleContinue = () => {
    // Your existing game logic
    
    // Track throw and potentially show ad
    incrementThrow();
    if (shouldShowAd && isAdReady) {
      showAd();
      resetCounter();
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.gameContent, { paddingBottom: BANNER_AD_HEIGHT + 10 }]}>
        {/* Your game UI */}
      </View>
      
      <BannerAd />
    </View>
  );
}
```

That's it! Would you like me to integrate this into your game screen now?
