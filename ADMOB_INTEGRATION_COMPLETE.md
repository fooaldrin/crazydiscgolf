# ✅ AdMob Integration Complete!

## What Was Integrated

### 1. **Banner Ad at Bottom of Game Screen**
- Positioned at the absolute bottom of the screen
- Doesn't cover any UI elements
- Always visible during gameplay
- Uses adaptive banner size (adjusts to screen width)

### 2. **Video Ads After Every 20 Throws**
- Tracks throws globally across all players
- Shows interstitial video ad after every 20 throws
- Displays at natural breaks (after "Next Shot" or "In Basket" buttons)
- Automatically resets counter after showing ad
- Only shows when ad is loaded and ready

### 3. **Automatic Test Mode**
- Development builds automatically show test ads
- No revenue generated in test mode
- Real ads will show in production builds

---

## Code Changes Made

### ✅ app/game/index.tsx

**Imports Added:**
```tsx
import { useThrowCounter } from '@/hooks/use-throw-counter';
import { BannerAd, useInterstitialAd, BANNER_AD_HEIGHT } from '@/components/ads';
```

**Hooks Initialized:**
```tsx
const { isAdReady, showAd } = useInterstitialAd();
const { shouldShowAd, incrementThrow, resetCounter } = useThrowCounter(20);
```

**handleContinue() Modified:**
- Added `incrementThrow()` to track each throw
- Added ad display logic:
  ```tsx
  if (shouldShowAd && isAdReady) {
    await showAd();
    resetCounter();
  }
  ```

**handleFinishHole() Modified:**
- Added `incrementThrow()` to track final throw
- Added same ad display logic

**Banner Ad Added:**
- Added `<BannerAd />` component at bottom of game screen
- Added padding to bottom button container: `paddingBottom: BANNER_AD_HEIGHT + 10`

---

## How It Works

### Throw Counter Logic
1. Player makes a throw (clicks "Next Shot" or "In Basket")
2. Counter increments: 1, 2, 3... up to 20
3. At throw #20, `shouldShowAd` becomes `true`
4. If video ad is ready, it displays
5. Counter resets to 0 after ad shows
6. Process repeats

### Banner Ad
- Loads automatically when game screen opens
- Fixed position at bottom
- Game content has padding to prevent overlap
- Visible throughout entire game

### Video Ad
- Pre-loads in background when game starts
- Shows after every 20 throws (configurable in `hooks/use-admob.ts`)
- Waits for ad to be ready before showing
- Automatically loads next ad after current one closes

---

## Testing Instructions

### Test in Development

1. **Start your dev server:**
   ```bash
   npx expo start --clear
   ```

2. **Run on a device/simulator:**
   ```bash
   npx expo run:ios
   # or
   npx expo run:android
   ```

3. **What to expect:**
   - Banner at bottom with "Test Ad" watermark
   - After 20 throws, video ad shows with test content
   - No real ads or revenue in development

### Test Checklist
- [ ] Banner ad appears at bottom of game screen
- [ ] Quit button is still fully visible (not covered by banner)
- [ ] After 20 throws, video ad displays
- [ ] Game continues normally after video ad closes
- [ ] Throw counter resets after video ad
- [ ] Next video ad shows after another 20 throws

---

## Before Publishing to Production

### ⚠️ Critical: Replace Test IDs

**Step 1: Get Your Real Ad Unit IDs**
1. Go to https://apps.admob.google.com
2. Select your app
3. Create ad units if you haven't:
   - Banner Ad Unit
   - Interstitial Ad Unit
4. Copy the Ad Unit IDs (format: `ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY`)

**Step 2: Create .env File**
Create `.env` in project root:
```env
EXPO_PUBLIC_ADMOB_BANNER_ID_IOS=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_IOS=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
```

**Step 3: Update app.json**
Replace test App IDs with your real ones:
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY",
          "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
        }
      ]
    ]
  }
}
```

**Step 4: Rebuild**
```bash
npx expo prebuild --clean
npx expo run:ios # or android
```

---

## Customization Options

### Change Throw Threshold
Edit `app/game/index.tsx`:
```tsx
// Show ad every 30 throws instead of 20
const { shouldShowAd, incrementThrow, resetCounter } = useThrowCounter(30);
```

Or edit the default in `hooks/use-admob.ts`:
```tsx
export const AdSettings = {
  throwsPerVideoAd: 30, // Change from 20 to 30
  // ...
};
```

### Remove Banner Ad
Just remove this line from `app/game/index.tsx`:
```tsx
<BannerAd />
```

And revert the padding in styles:
```tsx
bottomButtonContainer: {
  paddingBottom: 10, // Back to original
  // ...
}
```

### Disable Video Ads
Remove or comment out the ad display logic in `handleContinue()` and `handleFinishHole()`:
```tsx
// if (shouldShowAd && isAdReady) {
//   await showAd();
//   resetCounter();
// }
```

---

## Revenue Estimates

Based on typical AdMob rates:

**Banner Ad:**
- ~$1-2 eCPM (per 1000 impressions)
- If average player sees banner for 5 minutes: ~$0.01 per game

**Interstitial Video Ad:**
- ~$10-20 eCPM (per 1000 impressions)
- 20 throws = ~1-2 ads per 9-hole game: ~$0.02-0.04 per game

**Example Daily Revenue:**
- 100 active players
- 2 games per player average
- 200 games × $0.05/game = **~$10/day**
- **~$300/month**

*Actual rates vary by region, device, ad inventory, and user engagement.*

---

## Support & Resources

- **Google AdMob Console:** https://apps.admob.google.com
- **React Native Google Mobile Ads Docs:** https://docs.page/invertase/react-native-google-mobile-ads
- **Ad Policy:** https://support.google.com/admob/answer/6128543

---

## Troubleshooting

### Banner not showing
- Check console for errors
- Verify internet connection
- Test IDs are correct for development
- Try clearing cache: `npx expo start --clear`

### Video ad not showing
- Check if `isAdReady` is true (takes ~10 seconds to load)
- Verify you've reached 20 throws
- Check console for load errors
- Ads may take longer to load on slow connections

### "Ad failed to load" error
- Normal in development sometimes
- Check internet connection
- Try again, ads may not always be available
- In production, fill rate is typically 80-95%

---

## Summary

✅ **Banner ad** - Always visible at bottom  
✅ **Video ad** - Shows after every 20 throws  
✅ **Test mode** - Automatic in development  
✅ **Production ready** - Just add real IDs  
✅ **No errors** - All TypeScript checks pass  

**Your app is now monetized! 🎉**

Time to test it out and start earning revenue from your game!
