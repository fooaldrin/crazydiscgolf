# Submission Day Runbook (iOS)

Use this file on launch day. Follow top to bottom without skipping steps.

## Pre-Step) Publish Legal/Support Pages (GitHub Pages)

Run locally:

```bash
git add docs APP_STORE_METADATA_DRAFT.md SUBMISSION_DAY_RUNBOOK.md APP_STORE_LAUNCH_CHECKLIST.md
git commit -m "Add App Store privacy/support pages and launch docs"
git push origin main
```

Then in GitHub:

1. Open repository Settings -> Pages.
2. Source: Deploy from a branch.
3. Branch: main, Folder: /docs.
4. Save and wait for deployment.

Verify URLs:

- https://fooaldrin.github.io/crazydiscgolf/
- https://fooaldrin.github.io/crazydiscgolf/privacy/
- https://fooaldrin.github.io/crazydiscgolf/support/

## 0) Release Gate (Must All Be True)

- [ ] Apple Developer account is active
- [ ] App Store Connect access works
- [ ] AdMob account is reactivated
- [ ] Production AdMob app IDs and ad unit IDs are available
- [ ] Privacy Policy URL is live
- [ ] Support URL is live

If any are false, stop here and resolve before building.

## 1) Final Config Pass (10 minutes)

1. Update production AdMob IDs in [app.json](app.json).
2. Confirm app version in [package.json](package.json) and [app.json](app.json).
3. Confirm bundle ID and scheme in [app.json](app.json):
   - iOS bundle ID: com.crazydiscgolf.app
   - scheme: crazydiscgolf
4. Confirm EAS profiles in [eas.json](eas.json).

## 2) Clean Quality Gate (15 minutes)

Run:

```bash
npm install
npm run lint
```

Expected:

- lint exits with no errors/warnings you are not intentionally accepting.

## 3) Login and EAS Setup (once per machine)

Run:

```bash
npx eas login
npx eas whoami
```

If first time for this project:

```bash
npx eas build:configure
npx eas credentials
```

Expected:

- Correct Expo account/team is selected.
- iOS credentials are configured.

## 4) Production Build

Run:

```bash
npx eas build -p ios --profile production
```

Expected:

- Build completes successfully.
- Build artifact appears in Expo dashboard.

If build fails:

1. Fix the specific error.
2. Re-run same command.
3. Do not continue until build is green.

## 5) Submit to App Store Connect

Run:

```bash
npx eas submit -p ios --profile production
```

Expected:

- Build is uploaded to App Store Connect.
- Processing completes in App Store Connect.

## 6) App Store Connect Metadata Fill-In

Use [APP_STORE_METADATA_DRAFT.md](APP_STORE_METADATA_DRAFT.md) as source.

Fill:

1. App description
2. Keywords
3. Promotional text
4. What's New
5. Support URL
6. Privacy Policy URL
7. App Review notes

Use these values:

- Support URL: https://fooaldrin.github.io/crazydiscgolf/support/
- Privacy Policy URL: https://fooaldrin.github.io/crazydiscgolf/privacy/
- Marketing URL (optional): https://fooaldrin.github.io/crazydiscgolf/

Upload:

1. iPhone 6.7" screenshots
2. iPhone 6.5" screenshots (recommended)

## 7) Privacy and Compliance Confirmation

In App Store Connect, verify:

1. App Privacy labels match actual data use and ad SDK behavior.
2. Tracking/ATT declarations match actual implementation.
3. Age rating questionnaire completed.

Important:

- If you enable ATT-level tracking, add ATT prompt implementation and NSUserTrackingUsageDescription before submission.

## 8) TestFlight Smoke Test (Real Device)

Test on at least one real iPhone from TestFlight:

1. Cold launch
2. Start game
3. Multiplayer flow
4. Finish hole and game
5. Ad loading behavior
6. Background/foreground resume
7. Offline/poor network behavior

If a critical bug appears, stop and fix before review submission.

## 9) Submit for Review

When all above pass:

1. Select build in App Store Connect
2. Confirm release notes and metadata
3. Submit for App Review

## 10) If Rejected (Fast Recovery)

1. Read rejection reason and guideline reference carefully.
2. Reply in Resolution Center with concise, respectful details.
3. Fix fully (not partial) and resubmit.
4. Keep a short changelog of what was corrected.

## Copy/Paste Command Block

```bash
npm install
npm run lint
npx eas login
npx eas whoami
npx eas build -p ios --profile production
npx eas submit -p ios --profile production
```
