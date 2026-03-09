# EnategaSuperApp — Codex Agent Guide

This guide aligns with `guide/DEVELOPMENT_RULES.md`. When in doubt, follow those rules first.

## Structure and Ownership
- Keep each mini-app isolated under `src/apps/<appName>/` with its own `screens`, `navigation`, and `components`.
- Shared, cross-app code goes in `src/general/` only when used by more than one mini-app.
- Do not reference another mini-app’s internal components directly; share via `src/general/`.
- Screen-level UI components must live under `src/apps/<appName>/components/` (feature subfolders like `components/rideOptions/`), not inside `screens/`.
- Keep screens thin; push view logic into components or hooks.

## Reusability
- Prefer composition over duplication.
- Use shared primitives from `src/general/components/` (`Text`, `Button`, `Header`, `ScreenHeader`) for consistency.
- For loading placeholders, reuse the generic `src/general/components/Skeleton.tsx` primitive and build screen-specific skeleton layouts on top of it instead of creating separate animation implementations.

## Theming and Tokens
- All colors must come from `src/general/theme/colors.ts`.
- Typography sizes and fonts must come from `src/general/theme/typography.ts`.
- Access theme values via `useTheme()`; no hardcoded values unless justified.

## Localization (No Hardcoded Strings)
- All user-facing strings must be in localization files (English + French).
- Each app owns its translations under `src/apps/<appName>/localization/`.
- Shared screens and global labels belong in `src/general/localization/`.

## Navigation
- Navigators live under each app’s `navigation/` folder.
- Top-level routing changes go through `src/general/navigation/SharedNavigator.tsx` and `src/navigation/RootNavigator.tsx`.
- Avoid passing navigation logic deep into components; use screen-level handlers.

## Type Safety
- Use explicit `Props` types in every component and screen.
- Prefer literal union types for routing decisions.
- Avoid `any` (document if unavoidable).

## Naming and Consistency
- Filenames should match component names (PascalCase for components and screens).
- Use consistent screen naming (`HomeScreen`, `DetailsScreen`, etc.).
- Boolean props should use `is`/`has` prefixes.

## UI Layout and Styling
- Prefer `StyleSheet.create` over inline styles except for small dynamic values.
- Keep component trees shallow; extract complex layouts into smaller components.
- Use `ScreenHeader` for screen-level headers unless a screen requires a unique layout.

## Assets
- App-specific assets: `src/apps/<appName>/assets/`.
- Shared assets: `src/general/assets/`.
- Expo app-level assets (icons/splash): `assets/`.

## Data, Helpers, and Utils
- Shared helpers go in `src/general/utils/`.
- Avoid embedding mock data directly in screens; use mock constants.
- Secure storage keys must not start with `@`; use plain namespaced keys instead because `@`-prefixed keys have caused runtime issues in this project.

## Performance
- Memoize expensive components to avoid unnecessary re-renders.
- Use `FlatList` for large data sets.

## File Hygiene
- Keep files small and focused; split > ~200 lines.
- A component file must export only its primary component. Do not define additional component functions or other UI-returning helper methods in the same file; extract them into separate files.
- Remove dead code and unused imports promptly.

## Accessibility
- Add accessibility labels to actionable elements when possible.
- Ensure readable contrast.

## Testing and Quality
- Prefer unit tests for helpers and UI snapshot tests for stable UI blocks.
- Keep dependencies minimal and intentional.
