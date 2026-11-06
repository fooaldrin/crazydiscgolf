# App Store Review Audit (Based on iOS Review Article)

Date: 2026-06-10
Scope: Compared current project against the categories summarized in the article (privacy, performance, design/UX, business, legal, metadata).

## Summary

- Current status: Partially compliant, not submission-ready yet.
- Biggest blockers: account activation, AdMob production IDs, privacy/support URLs, store assets.

## Category-by-Category Check

### 1) Safety and Performance

Status: Mostly pass, with remaining manual QA needed.

Evidence:

- Lint passes: npm run lint.
- Core app config exists and runs in simulator workflows.

Gaps:

- No automated crash reporting integrated yet.
- No documented real-device regression checklist results yet.

### 2) Privacy and Data Transparency

Status: Pending.

Evidence:

- Ad SDK integrated (Google Mobile Ads) in app config and iOS plist.
- Ad app ID present in [ios/crazydiscgolf/Info.plist](ios/crazydiscgolf/Info.plist).

Gaps:

- Privacy Policy URL not set yet.
- App Privacy labels in App Store Connect still pending.
- ATT decision not finalized in checklist.

Important note:

- [ios/crazydiscgolf/Info.plist](ios/crazydiscgolf/Info.plist) currently does not include NSUserTrackingUsageDescription.
- If you enable user tracking/personalized ads across apps/sites, you must implement ATT flow and include that key before submission.

### 3) Business / Monetization

Status: Low risk currently.

Evidence:

- No in-app purchases/subscriptions found in codebase.
- Monetization is ad-based.

Gaps:

- Production AdMob account/IDs are pending reactivation.

### 4) Design and UX

Status: Likely acceptable, pending final manual checks.

Evidence:

- App has complete gameplay flow and settings flow.
- Orientation and iPad support configured in [app.json](app.json).

Gaps:

- Need final device-matrix smoke test before submission (launch, resume, offline, long session).

### 5) Metadata and Store Assets

Status: Pending.

Evidence:

- Draft metadata exists in [APP_STORE_METADATA_DRAFT.md](APP_STORE_METADATA_DRAFT.md).

Gaps:

- Final screenshots for required iPhone sizes not prepared yet.
- Final support URL and marketing URL not finalized.
- Final review notes should be copied into App Store Connect.

### 6) Legal and Account Readiness

Status: Blocked.

Evidence:

- You reported Apple Developer activation/identity verification still pending.

Gaps:

- App Store Connect must be fully accessible to complete privacy declarations and submission.

## Priority Fix Order

1. Resolve Apple Developer activation and identity verification.
2. Finish AdMob reactivation and obtain production app/ad unit IDs.
3. Publish Privacy Policy URL and Support URL.
4. Complete App Privacy labels in App Store Connect to match actual SDK/data behavior.
5. Prepare screenshots and finalize metadata text.
6. Run TestFlight build + real-device QA pass, then submit.

## Verdict

- The app is on-track, but not yet fully compliant for App Store submission.
- After the 6 priority steps above, risk of review rejection should drop significantly.
