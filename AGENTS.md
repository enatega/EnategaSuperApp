# EnategaSuperApp — Codex Agent Guide

## Project Overview

**EnategaSuperApp** is an Expo (React Native) super-app built with Expo Router. It targets iOS, Android, and Web from a single TypeScript codebase.

- **Framework**: Expo SDK with Expo Router (file-based routing)
- **Language**: TypeScript
- **Package manager**: npm
- **Bundle ID (iOS)**: `com.enategasuper.app`
- **Package (Android)**: `com.enategasuper.app`
- **EAS Project ID**: `4c12b75d-6b64-4ea6-a4a7-83e366964b04`
- **New Architecture**: Enabled (`newArchEnabled: true`)

## Repository Layout

```
app/           Expo Router routes and layouts
assets/        Images, fonts, and static files
components/    Shared React Native components
.eas/          EAS workflow YAML files (CI/CD)
.codex/skills/ Codex agent skills (see below)
eas.json       EAS build/submit profiles
app.json       Expo app configuration
```

## Skills

This project ships reusable Codex skills in `.codex/skills/`. Each skill is a folder containing a `SKILL.md` with detailed instructions, plus optional `references/` and `scripts/` subdirectories.

| Skill | Description |
|---|---|
| `building-native-ui` | Complete guide for building beautiful apps with Expo Router — styling, components, navigation, animations, native tabs |
| `expo-api-routes` | Creating API routes in Expo Router with EAS Hosting |
| `expo-cicd-workflows` | Writing EAS workflow YAML files for CI/CD and deployment automation |
| `expo-deployment` | Deploying to iOS App Store, Android Play Store, and web hosting |
| `expo-dev-client` | Building and distributing Expo development clients locally or via TestFlight |
| `expo-tailwind-setup` | Setting up Tailwind CSS v4 in Expo with react-native-css and NativeWind v5 |
| `native-data-fetching` | Network requests, API calls, React Query, SWR, error handling, caching, offline support |
| `upgrading-expo` | Upgrading Expo SDK versions and fixing dependency issues |
| `use-dom` | Using Expo DOM components to run web code in a webview on native |

You can invoke a skill explicitly with `$.skill-name` or Codex will activate the relevant skill automatically based on the task.

## Development Commands

```bash
# Start development server (try Expo Go first)
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# EAS build (cloud)
eas build -p ios --profile development
eas build -p android --profile development

# EAS deploy (web)
eas deploy
```

## Code Conventions

- **File naming**: Use kebab-case for all file names (e.g., `comment-card.tsx`)
- **Imports**: Use path aliases (`@/`) over deep relative imports
- **Routing**: Routes live in `app/`. Never co-locate components or utilities in `app/`
- **Styling**: Inline styles (no StyleSheet.create unless reusing styles). No CSS/Tailwind unless the tailwind skill is active.
- **Images/Icons**: Use `expo-image` with `source="sf:name"` for SF Symbols
- **Platform check**: Use `process.env.EXPO_OS` not `Platform.OS`
- **Context**: Use `React.use` not `React.useContext`
- **Shadows**: Use CSS `boxShadow` — never legacy React Native shadow styles
- **Safe Area**: Use `contentInsetAdjustmentBehavior="automatic"` on ScrollView/FlatList

## Testing

Run expo-doctor to check for issues:

```bash
npx expo-doctor
```

## Security

- Never expose API keys in client code — use `EXPO_PUBLIC_` prefix only for truly public values
- Store auth tokens in `expo-secure-store`, not AsyncStorage
- Server-side secrets go in API routes only (EAS Hosting / Cloudflare Workers)
