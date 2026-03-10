# Super Customer App Development Rules

These rules define the recommended approaches for clean, reusable, and maintainable code in this project.

## 1. Structure and Ownership
- Keep each mini-app isolated under `src/apps/<appName>/` with its own `screens`, `navigation`, and `components`.
- Put shared, cross-app code in `src/general/` only if used by more than one mini-app.
- Do not reference another mini-app’s internal components directly. Share through `src/general/`.
- Keep feature-level screens thin; prefer extracting view logic into reusable components or hooks.
- Screen-level UI components must live under `src/apps/<appName>/components/` (use a feature subfolder like `components/rideOptions/`), not inside `screens/`.

## 2. Reusability First
- Always check if a component is truly app-specific before creating it in a mini-app.
- Prefer composition over duplication: extract repeated UI patterns into `src/general/components/`.
- Use `Text`, `Button`, and `Header` from `src/general/components/` for consistent styling.
- For loading placeholders, reuse `src/general/components/Skeleton.tsx` as the base primitive and compose feature-specific skeleton designs from it instead of duplicating skeleton animation logic.

## 3. Theming and Design Tokens
- All colors must come from `src/general/theme/colors.ts`.
- All typography sizing and font usage must go through `src/general/theme/typography.ts`.
- Access theme values via `useTheme()`; do not hardcode values unless explicitly justified.

## 4. Localization (No Hardcoded Strings)
- Use `expo-localization` for device locale detection and `i18next` + `react-i18next` for translations.
- All user-facing strings must come from localization files (English + French).
- Each app owns its translations under `src/apps/<appName>/localization/`.
- Shared screens and global labels belong in `src/general/localization/`.
- Do not hardcode display text in components, screens, or navigation titles.

## 5. Navigation
- All navigators must live under each app’s `navigation/` folder.
- Top-level routing changes go through `src/general/navigation/SharedNavigator.tsx` and `src/navigation/RootNavigator.tsx`.
- Avoid passing navigation logic deep into components; use screen-level handlers.

## 6. Type Safety
- Use explicit `Props` types in every component and screen.
- Prefer literal union types for routing decisions (e.g., `'singleVendor' | 'multiVendor'`).
- Avoid `any`. If unavoidable, document why.

## 7. Naming and Consistency
- Filenames should match component names (PascalCase for components and screens).
- Use consistent screen naming (`HomeScreen`, `DetailsScreen`, etc.).
- Keep boolean props named with `is`/`has` prefixes.

## 8. UI Layout and Styling
- Prefer `StyleSheet.create` over inline styles except for small dynamic values.
- Avoid deeply nested layouts; keep component trees shallow.
- Extract complex layout blocks into smaller components.

## Assets
- Store app-specific assets under `src/apps/<appName>/assets/`.
- Store shared assets under `src/general/assets/`.
- Expo app-level assets (icons/splash) stay in `assets/`.
- Avoid placing app-specific assets in shared or global folders.

## 9. Data, Helpers, and Utils
- Use `src/general/utils/` for shared helpers.
- Avoid embedding mock data directly into screens; use mock data constants where needed.
- Secure storage keys must not start with `@`; use plain namespaced keys instead because `@`-prefixed keys have caused issues in this project.

## 10. Performance Basics
- Avoid unnecessary re-renders by memoizing expensive components.
- Keep list rendering efficient; use `FlatList` for large data.

## 11. File Hygiene
- Keep files small and focused. If a file grows beyond ~200 lines, consider splitting.
- A component file should contain only one UI component export. Do not add extra component functions or helper methods that also return UI inside the same file; move them into separate files.
- Remove dead code and unused imports promptly.

## 12. Accessibility
- Provide accessible labels on actionable elements when possible.
- Ensure color contrast meets readability standards.

## 13. Tests and Quality
- Prefer unit tests for helpers and UI snapshot tests for stable UI blocks when feasible.
- Keep `package.json` dependencies minimal and intentional.
