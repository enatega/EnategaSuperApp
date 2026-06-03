# EnategaSuperApp Rebranding Guide

This guide is the standard flow to prepare `EnategaSuperApp` for a new client.

## 1) Branch Strategy

1. Start from `main` and create a dedicated client branch.
2. Use naming like `client/<client-name>`.
3. Keep client-specific customizations only in that branch.
4. Continue fixing shared bugs in `main`, then merge `main` into each client branch.

## 2) Rebranding Inputs (Collect Before Changes)

Collect these from client/backend/devops first:

1. App name, slug, bundle/package ID:
   - App display name
   - Expo slug
   - iOS bundle identifier
   - Android package name
2. Environment + backend:
   - `EXPO_PUBLIC_API_BASE_URL`
   - `EXPO_PUBLIC_SOCKET_URL`
   - `EXPO_PUBLIC_HOME_SERVICES_SOCKET_URL`
3. OAuth and auth keys:
   - `EXPO_PUBLIC_ANDROID_OAUTH_CLIENT_ID`
   - `EXPO_PUBLIC_IOS_CLIENT_ID`
   - `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (recommended to set explicitly)
   - `EXPO_PUBLIC_IOS_URL_SCHEME` (Google reversed client ID style)
4. Payments/maps:
   - `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `GOOGLE_MAPS_API_KEY`
5. Firebase/Google services files:
   - Android `google-services.json`
   - iOS `GoogleService-Info.plist` (if iOS Firebase services are used)
6. Branding:
   - App icon, adaptive icon foreground, splash, favicon
   - Primary/secondary colors
7. Legal/business:
   - Support email
   - Business address

## 3) Update Environment Variables

Edit [`.env`](/EnategaSuperApp/.env) with client values:

1. `EXPO_PUBLIC_API_BASE_URL`
2. `EXPO_PUBLIC_SOCKET_URL`
3. `EXPO_PUBLIC_HOME_SERVICES_SOCKET_URL`
4. `EXPO_PUBLIC_ANDROID_OAUTH_CLIENT_ID`
5. `EXPO_PUBLIC_IOS_CLIENT_ID`
6. `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (add this key if missing)
7. `EXPO_PUBLIC_IOS_URL_SCHEME`
8. `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
9. `GOOGLE_MAPS_API_KEY`
10. Optional:
   - `EXPO_PUBLIC_EAS_PROJECT_ID` (if needed for push token resolution fallback)
   - `EXPO_PUBLIC_API_ENV`
   - `EXPO_PUBLIC_SOCKET_PATH`
   - `EXPO_PUBLIC_SOCKET_DEBUG`

Notes:

1. `EXPO_PUBLIC_API_BASE_URL` is required by code at [apiConfig.ts](/EnategaSuperApp/src/general/config/apiConfig.ts).
2. `EXPO_PUBLIC_HOME_SERVICES_SOCKET_URL` is required by code at [homeServicesSocket.ts](/EnategaSuperApp/src/apps/homeVisits/socket/homeServicesSocket.ts).

## 4) Update Expo App Identity

Edit [app.config.js](/EnategaSuperApp/app.config.js):

1. `expo.name`
2. `expo.slug`
3. `expo.ios.bundleIdentifier`
4. `expo.android.package`
5. iOS permission strings containing old app name

Client-specific values currently hardcoded here:

1. `updates.url`
2. `extra.eas.projectId`

Important:

1. `updates.url` and `extra.eas.projectId` should match the client’s Expo project, not the base app project.
2. If you create a new Expo project for the client, update both values accordingly.

## 5) Replace Platform Config Files

1. Replace [google-services.json](/EnategaSuperApp/google-services.json) with the client’s Android Firebase config.
2. Confirm the `package_name` in that file matches `expo.android.package`.
3. If iOS Firebase is required, ensure `GoogleService-Info.plist` is added and wired in Expo config.

## 6) Replace Branding Assets

Replace:

1. [icon.png](/EnategaSuperApp/assets/icon.png)
2. [adaptive-icon.png](/EnategaSuperApp/assets/adaptive-icon.png)
3. [splash-icon.png](/EnategaSuperApp/assets/splash-icon.png)
4. [favicon.png](/EnategaSuperApp/assets/favicon.png)

## 7) Apply Client Theme Colors

Adjust color tokens in [colors.ts](/EnategaSuperApp/src/general/theme/colors.ts):

1. Base tokens (`primary`, `secondary`, gradients, etc.)
2. App-level overrides in `appColorOverrides` if client wants per-mini-app variations

## 8) Update Client-Facing Text and Legal Data

At minimum update:

1. App name:
   - [general/en.ts](/EnategaSuperApp/src/general/localization/general/en.ts)
   - [general/fr.ts](/EnategaSuperApp/src/general/localization/general/fr.ts)
2. Contact email and address in legal sections:
   - [general/en.ts](/EnategaSuperApp/src/general/localization/general/en.ts)
   - [general/fr.ts](/EnategaSuperApp/src/general/localization/general/fr.ts)
   - [deliveries/en.ts](/EnategaSuperApp/src/apps/deliveries/localization/en.ts)
   - [deliveries/fr.ts](/EnategaSuperApp/src/apps/deliveries/localization/fr.ts)
3. Hardcoded legal address in ridesharing screens:
   - [TermsAndConditionsScreen.tsx](/EnategaSuperApp/src/apps/rideSharing/screens/settings/TermsAndConditionsScreen.tsx)
   - [LicencesScreen.tsx](/EnategaSuperApp/src/apps/rideSharing/screens/settings/LicencesScreen.tsx)

## 9) Validate Before Build

1. Start app once:
   - `npm start`
2. Validate:
   - App launches
   - Login (phone + Google if enabled)
   - Maps load
   - Sockets connect
   - Stripe card sheet opens
   - Push token registration path works
3. Run native builds:
   - `npx expo run:android`
   - `npx expo run:ios`

## 10) Submission Checklist

1. Confirm IDs are unique per client:
   - iOS bundle identifier
   - Android package
   - Expo project ID
2. Confirm production URLs and keys are production-ready.
3. Confirm app icon/splash shown correctly on device.
4. Confirm legal text, support email, and address are client-specific.
5. Commit changes with message:
   - `chore(client): rebrand <client-name> baseline config`

## 11) Recommended Operational Improvement

Current `.env` contains multiple clients in one file (commented blocks). Prefer:

1. `.env.template` (required keys only, no secrets)
2. `.env.client-<name>` per client (not committed with secrets)
3. A small setup script later (optional) to copy/select env files and patch `app.config.js`.

## 12) Client Intake Form (Fill This First)

Use this exact format. Developer fills it once, then AI agent uses it to apply changes in `.env`, `app.config.js`, assets, theme, and legal text.

```md
# Client Rebranding Intake - EnategaSuperApp

## Client Identity


## Expo Project


## Backend and Socket URLs


## Auth (Google)


## Payments and Maps


## Legal and Business


## Branding and Design


## Files Provided


## Notes
CUSTOM_CLIENT_REQUIREMENTS=
```

## 13) Rebranding Progress Tracker (Tick as Completed)

Mark each step with `✅` when done.

- ✅ 1. Client branch created from `main`
- ✅ 2. Intake form completed and validated
- ✅ 3. `.env` values replaced from intake form
- ✅ 4. `app.config.js` identity updated (`name`, `slug`, bundle/package)
- ✅ 5. `updates.url` and `extra.eas.projectId` updated for client Expo project
- ✅ 6. `google-services.json` replaced and package verified
- ✅ 7. iOS `GoogleService-Info.plist` added/configured (if needed)
- ⬜ 8. Branding assets replaced (`icon`, `adaptive-icon`, `splash`, `favicon`)
- ✅ 9. Theme colors updated in `colors.ts`
- ✅ 10. Legal/contact text updated (general + deliveries + ridesharing)
- ⬜ 11. Smoke test passed (`npm start`)
- ⬜ 12. Android native run passed (`npx expo run:android`)
- ⬜ 13. iOS native run passed (`npx expo run:ios`)
- ⬜ 14. Final QA checklist passed for submission
- ⬜ 15. Commit created: `chore(client): rebrand <client-name> baseline config`
