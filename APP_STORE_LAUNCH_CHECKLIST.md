# Crazy Discgolf - App Store Launch Checklist

This checklist is for first-time iOS release with Expo + EAS + AdMob.

Status key:

- Checked items are verified from the repository/config.
- Unchecked items require Apple account action, legal decisions, or manual completion.

## 0. Account Status (Current Blocker)

- [ ] Apple Developer enrollment fully activated
- [ ] Apple identity verification issue resolved (if still blocked)
- [ ] App Store Connect access confirmed

If identity is stuck:

- Contact Apple Developer Support from developer.apple.com/contact
- Provide enrollment ID, legal name, and exact error message
- Ask for manual identity review after failed driver's license verification

## 1. App Configuration

- [x] Confirm iOS bundle ID in app config: com.crazydiscgolf.app
- [x] Confirm app version in package.json / app config
- [ ] Set production AdMob IDs (replace Google test IDs before release)
- [x] Confirm deep linking scheme: crazydiscgolf

Current note:

- AdMob account reactivation is pending, so production AdMob IDs are temporarily blocked.
- Keep test IDs in development until AdMob is fully reactivated.

While AdMob is pending, finish these:

- Prepare App Store screenshots and final app description.
- Finalize Privacy Policy URL and Support URL.
- Complete Apple account activation and identity verification.
- Run one full gameplay regression pass on simulator and real device.

GitHub Pages publish checklist (for Privacy/Support URLs):

- [ ] Push current branch to GitHub
- [ ] In GitHub repo settings, enable Pages from branch main and folder /docs
- [ ] Confirm these URLs load publicly in a browser:
  - https://fooaldrin.github.io/crazydiscgolf/
  - https://fooaldrin.github.io/crazydiscgolf/privacy/
  - https://fooaldrin.github.io/crazydiscgolf/support/

## 2. Legal and Privacy

- [ ] Publish a Privacy Policy page (public URL: https://fooaldrin.github.io/crazydiscgolf/privacy/)
- [ ] Add Support URL (https://fooaldrin.github.io/crazydiscgolf/support/)
- [ ] Fill App Privacy details in App Store Connect
- [ ] Confirm ad/tracking declarations match app behavior
- [ ] Decide ATT strategy (show prompt if tracking users across apps/sites)

## 3. Build and Submission Setup

- [ ] Install EAS CLI globally or use npx
- [ ] Log in: npx eas login
- [ ] Configure project: npx eas build:configure
- [x] Verify eas.json profiles (development/preview/production)
- [ ] Configure credentials: npx eas credentials

## 4. TestFlight Release Flow

- [ ] Build iOS production binary: npx eas build -p ios --profile production
- [ ] Submit to App Store Connect: npx eas submit -p ios --profile production
- [ ] Add internal testers in TestFlight
- [ ] Validate ad behavior in real-device TestFlight build
- [ ] Verify no crashes on cold start / resume / offline mode

## 5. Store Listing Assets

- [ ] App name, subtitle, and keyword set finalized
- [ ] Description finalized
- [ ] 6.7-inch screenshots prepared
- [ ] 6.5-inch screenshots prepared (recommended)
- [ ] App icon finalized (1024x1024 source)
- [ ] Age rating questionnaire completed

## 6. Final Release Checks

- [x] Lint passes: npm run lint
- [ ] All known critical bugs resolved
- [ ] TestFlight build approved by Apple (if required)
- [ ] App Review notes include any required tester steps
- [ ] Submit for App Review

## 7. Post-Launch Minimums

- [ ] Add crash reporting (Sentry recommended)
- [ ] Add lightweight analytics (game start, game complete, ad shown)
- [ ] Monitor crash-free sessions and ANR/crash logs weekly
