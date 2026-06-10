# 🎯 How to Add Your AdMob IDs

## Step 1: Get Your IDs from AdMob Console

### Go to https://apps.admob.google.com

1. **Sign in** to your AdMob account
2. **Select your app** (or create a new app)

### Get Your App IDs (with `~`)

These identify your entire app:

- Navigate to: **App settings** → **App settings**
- Copy the **App ID** for iOS (starts with `ca-app-pub-` and has `~`)
- Copy the **App ID** for Android (starts with `ca-app-pub-` and has `~`)

Example: `ca-app-pub-1234567890123456~0987654321`

### Get Your Ad Unit IDs (with `/`)

These identify specific ad placements:

1. Navigate to: **Ads** → **Ad units**
2. Create or find your **Banner ad unit**
3. Copy the **Ad unit ID** (has `/` not `~`)
4. Create or find your **Interstitial ad unit**
5. Copy the **Ad unit ID**

Example: `ca-app-pub-1234567890123456/1234567890`

---

## Step 2: Add App IDs to `app.json`

Open `app.json` and find the `react-native-google-mobile-ads` plugin:

```json
[
  "react-native-google-mobile-ads",
  {
    "androidAppId": "ca-app-pub-REPLACE_WITH_YOUR_ANDROID_APP_ID",
    "iosAppId": "ca-app-pub-REPLACE_WITH_YOUR_IOS_APP_ID"
  }
]
```

**Important:** These should have `~` (tilde), not `/` (slash)!

---

## Step 3: Add Ad Unit IDs to `.env`

Open the `.env` file in your project root and replace the test IDs:

```env
# iOS Ad Unit IDs
EXPO_PUBLIC_ADMOB_BANNER_ID_IOS=ca-app-pub-YOUR_ID/YOUR_BANNER_ID
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_IOS=ca-app-pub-YOUR_ID/YOUR_INTERSTITIAL_ID

# Android Ad Unit IDs
EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID=ca-app-pub-YOUR_ID/YOUR_BANNER_ID
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID=ca-app-pub-YOUR_ID/YOUR_INTERSTITIAL_ID
```

**Important:** These should have `/` (slash), not `~` (tilde)!

---

## Step 4: Rebuild Your App

After changing IDs, you **must rebuild**:

```bash
# Clear cache and rebuild
npx expo run:ios --clear
# or
npx expo run:android --clear
```

---

## 📋 Quick Reference: What Goes Where

| ID Type | Format | Location |
|---------|--------|----------|
| **App ID** | `ca-app-pub-XXX~YYY` (with `~`) | `app.json` |
| **Banner Ad Unit ID** | `ca-app-pub-XXX/YYY` (with `/`) | `.env` file |
| **Interstitial Ad Unit ID** | `ca-app-pub-XXX/YYY` (with `/`) | `.env` file |

---

## ⚠️ Important Notes

### Keep Using Test IDs During Development!

The current test IDs are perfect for development:
- ✅ Show test ads with "Test Ad" watermark
- ✅ Don't count as real impressions
- ✅ Won't affect your AdMob account metrics

### Only Use Real IDs for Production!

Switch to real IDs when:
- ✅ You're ready to publish to App Store / Play Store
- ✅ You've thoroughly tested the app
- ✅ You're ready to start earning revenue

### Never Commit Real IDs to Git!

Add `.env` to your `.gitignore`:
```
# AdMob credentials
.env
```

---

## 🧪 How to Test

### With Test IDs (Current Setup)
1. Run the app: `npx expo run:ios` or `npx expo run:android`
2. Play 20 throws
3. Video ad shows with "Test Ad" watermark
4. Banner at bottom shows "Test Ad"

### With Real IDs (Production)
1. Update `app.json` with real App IDs
2. Update `.env` with real Ad Unit IDs
3. Rebuild: `npx expo run:ios --clear`
4. Ads show without "Test Ad" watermark
5. Real impressions count in AdMob dashboard
6. You start earning money! 💰

---

## 🔍 Where to Find Your IDs

### App IDs (with `~`)
```
AdMob Console → Apps → [Your App] → App settings → App settings
```

### Ad Unit IDs (with `/`)
```
AdMob Console → Apps → [Your App] → Ads → Ad units
```

---

## 🚨 Troubleshooting

### "Ad failed to load"
- ✅ Check internet connection
- ✅ Verify IDs are correct (no typos)
- ✅ Make sure you rebuilt after changing IDs
- ✅ Wait 24-48 hours after creating new ad units

### "App crashes on launch"
- ✅ Check App IDs in `app.json` are correct
- ✅ Make sure App IDs use `~` not `/`
- ✅ Rebuild the app with `--clear` flag

### "Banner not showing"
- ✅ Check Banner Ad Unit IDs in `.env`
- ✅ Make sure Banner IDs use `/` not `~`
- ✅ Check console for error messages

---

## 📚 Current Configuration

Your app is currently configured with **Google's test IDs**:

**App IDs in `app.json`:**
- iOS: `ca-app-pub-3940256099942544~1458002511`
- Android: `ca-app-pub-3940256099942544~3347511713`

**Ad Unit IDs in `.env`:**
- Banner (iOS): `ca-app-pub-3940256099942544/2934735716`
- Banner (Android): `ca-app-pub-3940256099942544/6300978111`
- Interstitial (iOS): `ca-app-pub-3940256099942544/4411468910`
- Interstitial (Android): `ca-app-pub-3940256099942544/1033173712`

These are **safe to use for development and testing**! Replace them only when you're ready to publish.

---

Ready to add your real IDs? Just follow Steps 1-4 above! 🚀
