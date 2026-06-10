# Google AdMob Integration Guide

## Overview

This guide explains how to implement Google AdMob ads in your Crazy Disc Golf app:
1. **Banner Ad** - Permanent banner at bottom of game screen
2. **Interstitial Video Ad** - Shows after every 20 throws

## Setup Steps

### 1. Install Required Packages

```bash
npx expo install expo-ads-admob
```

### 2. Configure AdMob IDs

#### Get Your Ad Unit IDs from Google AdMob:
1. Go to https://apps.admob.google.com
2. Create ad units:
   - Banner ad unit
   - Interstitial video ad unit
3. Copy the Ad Unit IDs

#### Add to app.json:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-ads-admob",
        {
          "userTrackingPermission": "This allows us to show you personalized ads."
        }
      ]
    ],
    "ios": {
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
      }
    },
    "android": {
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
      }
    }
  }
}
```

**Note:** Replace with your actual Google AdMob App IDs.

### 3. Environment Variables

Create `.env` file in project root:

```env
# Google AdMob Ad Unit IDs
# Test IDs (use these for development)
EXPO_PUBLIC_ADMOB_BANNER_ID_IOS=ca-app-pub-3940256099942544/2934735716
EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID=ca-app-pub-3940256099942544/6300978111
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_IOS=ca-app-pub-3940256099942544/4411468910
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID=ca-app-pub-3940256099942544/1033173712

# For production, replace with your real Ad Unit IDs:
# EXPO_PUBLIC_ADMOB_BANNER_ID_IOS=ca-app-pub-YOUR_ID/YOUR_BANNER_ID
# EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID=ca-app-pub-YOUR_ID/YOUR_BANNER_ID
# EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_IOS=ca-app-pub-YOUR_ID/YOUR_INTERSTITIAL_ID
# EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID=ca-app-pub-YOUR_ID/YOUR_INTERSTITIAL_ID
```

## Implementation Structure

### File Organization:

```
hooks/
  └── use-admob.ts              # AdMob configuration and IDs
  └── use-throw-counter.ts       # Track throws for video ads

components/
  └── ads/
      ├── banner-ad.tsx          # Banner ad component
      └── interstitial-ad.tsx    # Video ad component (logic only)
```

## Usage in Game Screen

### app/game/index.tsx:

```tsx
import { BannerAd } from '@/components/ads/banner-ad';
import { useInterstitialAd } from '@/components/ads/interstitial-ad';
import { useThrowCounter } from '@/hooks/use-throw-counter';

export default function GameScreen() {
  // Track throws across all players for video ads
  const { incrementThrow, shouldShowAd, resetCounter } = useThrowCounter(20);
  
  // Interstitial video ad
  const { showInterstitial } = useInterstitialAd();
  
  const handleContinue = async () => {
    // ... existing throw logic ...
    
    // Increment throw counter
    incrementThrow();
    
    // Show video ad if threshold reached
    if (shouldShowAd) {
      await showInterstitial();
      resetCounter();
    }
    
    // ... rest of logic ...
  };
  
  return (
    <View style={{ flex: 1 }}>
      {/* Game content */}
      <View style={{ flex: 1 }}>
        {/* ... existing game UI ... */}
      </View>
      
      {/* Banner ad at bottom */}
      <BannerAd />
    </View>
  );
}
```

## Best Practices

### 1. Ad Placement

✅ **Banner Ad:**
- Bottom of game screen (doesn't cover gameplay)
- Persistent across game session
- Use `position: 'absolute'` with `bottom: 0`

✅ **Interstitial Ad:**
- Show at natural breaks (after throws, between holes)
- Never interrupt active gameplay
- Track total throws, not per-player

### 2. User Experience

✅ **Do:**
- Show video ads at predictable intervals
- Display ads during transitions
- Allow gameplay to continue if ad fails
- Test with test ad IDs first

❌ **Don't:**
- Show ads during slot machine animation
- Block critical UI with banner
- Show video ads too frequently
- Interrupt mid-throw

### 3. Error Handling

```tsx
// Always handle ad failures gracefully
try {
  await showInterstitial();
} catch (error) {
  console.log('Ad not ready or failed:', error);
  // Continue game normally
}
```

### 4. Development vs Production

**Development:**
- Use Google's test ad IDs (provided in .env)
- Test on real devices (ads don't show in simulator)
- Verify ad loading and display

**Production:**
- Replace with real Ad Unit IDs
- Remove console.log for ad events
- Monitor AdMob dashboard for performance

## Ad Timing Strategy

### Throw-Based Video Ads (Current Implementation):

```
Throw 1-19:  No ad
Throw 20:    → Video ad
Throw 21-39: No ad  
Throw 40:    → Video ad
...
```

**Pros:**
- Predictable for players
- Fair across different game lengths
- Easy to adjust threshold

### Alternative: Hole-Based Ads

```tsx
// Show ad every 3 holes instead
const handleFinishHole = async () => {
  if ((currentHole + 1) % 3 === 0 && currentHole < numHoles - 1) {
    await showInterstitial();
  }
  // ... rest of logic
};
```

### Alternative: Time-Based Ads

```tsx
// Show ad every 5 minutes
const lastAdTime = useRef(Date.now());

if (Date.now() - lastAdTime.current > 5 * 60 * 1000) {
  await showInterstitial();
  lastAdTime.current = Date.now();
}
```

## Revenue Optimization

### Banner Ad:
- **eCPM:** ~$0.50-$2.00
- **Position:** Bottom (higher viewability)
- **Size:** Standard (320x50)

### Interstitial Video Ad:
- **eCPM:** ~$10-$20 (much higher!)
- **Frequency:** Every 20 throws (good balance)
- **Timing:** Natural game breaks

### Estimated Revenue (Example):

**Assumptions:**
- 100 daily active users
- Average 60 throws per session
- 50% video ad fill rate

**Calculations:**
```
Banner impressions: 100 users × 1 session = 100
Banner revenue: 100 × $0.01 = $1/day

Video impressions: 100 users × 3 ads = 300
Video revenue: 300 × $0.15 = $45/day

Total: ~$46/day = ~$1,380/month
```

## Testing Checklist

Before Publishing:

- [ ] Banner ad displays at bottom of game screen
- [ ] Banner doesn't cover game buttons
- [ ] Video ad shows after 20 throws
- [ ] Video ad can be skipped/closed
- [ ] Game continues if ad fails to load
- [ ] Throw counter persists across holes
- [ ] Ads work on both iOS and Android
- [ ] Real ad IDs configured for production
- [ ] AdMob account fully verified
- [ ] App linked to AdMob account

## Common Issues

### Issue: "Ad failed to load"
**Solution:** 
- Check internet connection
- Verify Ad Unit IDs are correct
- Ensure app is linked in AdMob dashboard
- Wait 24-48 hours after creating ad units

### Issue: Banner ad covers buttons
**Solution:**
- Add padding to bottom of game screen
- Use `flex: 1` for game content
- Position banner absolutely at bottom

### Issue: Too many video ads
**Solution:**
- Increase throw threshold (20 → 30)
- Add cooldown timer between ads
- Switch to hole-based frequency

### Issue: Ads not showing in development
**Solution:**
- Use test ad IDs (provided)
- Test on real device, not simulator
- Check AdMob account status

## Compliance

### COPPA (Children's Privacy):
If your app is for children under 13:
```tsx
import { AdMobConsent } from 'expo-ads-admob';

// Mark as child-directed
await AdMobConsent.setTagForChildDirectedTreatment(true);
```

### GDPR (EU Users):
Show consent dialog for EU users:
```tsx
const consentStatus = await AdMobConsent.requestConsentInfoUpdateAsync();
if (consentStatus.isRequestLocationInEeaOrUnknown) {
  await AdMobConsent.showFormAsync();
}
```

## Next Steps

1. Install expo-ads-admob package
2. Create ad units in AdMob dashboard
3. Add App ID to app.json
4. Implement hooks and components (provided below)
5. Test with test ad IDs
6. Deploy and replace with real IDs
7. Monitor AdMob dashboard

## Resources

- [Expo AdMob Docs](https://docs.expo.dev/versions/latest/sdk/admob/)
- [Google AdMob Console](https://apps.admob.google.com/)
- [AdMob Best Practices](https://support.google.com/admob/answer/6128543)
- [Ad Placement Guidelines](https://support.google.com/admob/answer/6066980)
