import type { DeliveriesAppSettings } from '../stores/useAppConfigStore';

export type ThemedMiniAppId =
  | "general"
  | "deliveries"
  | "rideSharing"
  | "homeVisits"
  | "appointments"
  | "developerMode";

const baseLightColors = {
  background: "#FFFFFF",
  backgroundTertiary: "#F4F4F5",
  surface: "#FFFFFF",
  primary: "#2346E8",
  primaryDark: "#1C2FA6",
  secondary: "#6B5BFF",
  text: "#111827",
  mutedText: "#6B7280",
  border: "#E4E4E7",
  success: "#10B981",
  successSoft: "#F0FDF4",
  successText: "#047857",
  warning: "#F59E0B",
  warningSoft: "#FEFCE8",
  warningText: "#A16207",
  danger: "#EF4444",
  dangerSoft: "#FEF2F2",
  dangerText: "#DC2626",
  cardBlue: "#F1F5F9",
  cardMint: "#E6FAF5",
  cardLavender: "#EDE8FF",
  cardPeach: "#FFEAD7",
  homeHeaderBackground: "#E8E7FF",
  cardSoft: "#F2F5FF",
  surfaceSoft: "#FAFAFA",
  splashGradientStart: "#1440CE",
  splashGradientEnd: "#1E40AF",
  bannerGradientStart: "#1A46D6",
  bannerGradientEnd: "#1E40AF",
  homeHeaderGradientStart: "rgba(30, 64, 175, 0.4)",
  homeHeaderGradientEnd: "rgba(203, 215, 255, 0.4)",
  blue50: "#EFF6FF",
  blue100: "#DBEAFE",
  blue500: "#3B82F6",
  blue800: "#1E40AF",
  green100: "#D1FAE5",
  iconMuted: "#71717A",
  iconDisabled: "#A1A1AA",
  overlayDark20: "rgba(0, 0, 0, 0.2)",
  shadowColor: "#000000",
  white: "#FFFFFF",
  iconColor: "#27272A",
  gray100: "#F3F4F6",
  findingRideSweepTrack: "#E9E9EC",
  findingRideSweepEdge: "#F4F4F5",
  findingRideSweepCenter: "#0EA170",
  findingRidePrimary: "#1691BF",
  findingRidePrimarySoft: "#DDF5FF",
  findingRideMutedSurface: "#ECECEE",
  findingRideMutedText: "#9C9CA4",
  findingRideBorderSoft: "#EEEEF2",
  findingRideHandle: "#D7D7DB",
  findingRidePulseA: "#8FDDF3",
  findingRidePulseB: "#65C6E9",
  findingRidePulseC: "#2FA8D3",
  findingRideCenterHalo: "rgba(175, 231, 247, 0.72)",
  findingRideMapOverlay: "rgba(255, 255, 255, 0.2)",
  yellow500: "#EAB308",
  red100: "#FEE2E2",
  storeHeroPrimary: "#009A2B",
  storeHeroSecondary: "#005A2B",
  storeHeroOverlay: "rgba(0, 90, 43, 0.22)",
  storeMenuAccentLime: "#A9D329",
  storeMenuAccentOrange: "#F86A33",
  supportTicketHeaderBackground: "#111827",
};

export type ThemeColors = typeof baseLightColors;

type ThemeScheme = "light" | "dark";
type ThemeColorOverrides = Partial<ThemeColors>;
type ThemeColorOverrideSet = Record<ThemeScheme, ThemeColorOverrides>;

function normalizeHexColor(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  const normalizedValue = trimmedValue.startsWith("#") ? trimmedValue : `#${trimmedValue}`;

  if (/^#[0-9A-Fa-f]{6}$/.test(normalizedValue)) {
    return normalizedValue.toUpperCase();
  }

  return null;
}

function hexToRgb(hex: string) {
  const sanitizedHex = hex.replace("#", "");
  return {
    r: Number.parseInt(sanitizedHex.slice(0, 2), 16),
    g: Number.parseInt(sanitizedHex.slice(2, 4), 16),
    b: Number.parseInt(sanitizedHex.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0").toUpperCase();

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixColors(baseHex: string, mixHex: string, weight: number) {
  const baseRgb = hexToRgb(baseHex);
  const mixRgb = hexToRgb(mixHex);

  return rgbToHex(
    baseRgb.r * (1 - weight) + mixRgb.r * weight,
    baseRgb.g * (1 - weight) + mixRgb.g * weight,
    baseRgb.b * (1 - weight) + mixRgb.b * weight,
  );
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lighten(hex: string, amount: number) {
  return mixColors(hex, "#FFFFFF", amount);
}

function darken(hex: string, amount: number) {
  return mixColors(hex, "#000000", amount);
}

function buildDeliveriesDynamicOverrides(
  scheme: ThemeScheme,
  appSettings?: DeliveriesAppSettings | null,
): ThemeColorOverrides {
  const primaryColor = normalizeHexColor(appSettings?.primary_color);
  const secondaryColor = normalizeHexColor(appSettings?.secondary_color);
  const tertiaryColor = normalizeHexColor(appSettings?.tertiary_color);

  if (!primaryColor && !secondaryColor && !tertiaryColor) {
    return {};
  }

  const resolvedPrimary = primaryColor ?? baseLightColors.primary;
  const resolvedSecondary = secondaryColor ?? resolvedPrimary;
  const resolvedTertiary = tertiaryColor ?? resolvedSecondary;
  const warmSurfaceSoft = lighten(resolvedTertiary, 0.34);
  const warmSurfaceStrong = mixColors(resolvedTertiary, resolvedSecondary, 0.08);
  const darkAccent = darken(resolvedPrimary, 0.04);
  const darkBannerEnd = mixColors(resolvedPrimary, resolvedSecondary, 0.24);

  if (scheme === "dark") {
    const darkSurface = mixColors("#111827", resolvedPrimary, 0.6);
    const darkSurfaceSoft = mixColors(darkSurface, resolvedSecondary, 0.08);
    const darkWarmAccent = mixColors(resolvedSecondary, resolvedPrimary, 0.7);
    const lightPrimary = lighten(resolvedTertiary, 0.04);

    return {
      primary: lightPrimary,
      primaryDark: resolvedSecondary,
      secondary: resolvedSecondary,
      blue50: darkSurfaceSoft,
      blue100: darkWarmAccent,
      blue500: resolvedSecondary,
      blue800: lightPrimary,
      cardSoft: darkSurfaceSoft,
      homeHeaderBackground: darkSurface,
      splashGradientStart: darkSurface,
      splashGradientEnd: mixColors(darkSurface, resolvedSecondary, 0.14),
      bannerGradientStart: darkSurface,
      bannerGradientEnd: mixColors(darkSurface, resolvedSecondary, 0.22),
      homeHeaderGradientStart: withAlpha(resolvedSecondary, 0.14),
      homeHeaderGradientEnd: withAlpha(resolvedTertiary, 0.12),
      yellow500: resolvedSecondary,
      storeMenuAccentLime: mixColors(resolvedTertiary, resolvedPrimary, 0.5),
      storeMenuAccentOrange: mixColors(resolvedSecondary, resolvedPrimary, 0.34),
      findingRidePrimary: resolvedSecondary,
      findingRidePrimarySoft: darkWarmAccent,
      findingRidePulseA: mixColors(resolvedSecondary, darkSurface, 0.48),
      findingRidePulseB: mixColors(resolvedSecondary, darkSurface, 0.3),
      findingRidePulseC: resolvedSecondary,
      findingRideCenterHalo: withAlpha(resolvedSecondary, 0.22),
    };
  }

  return {
    primary: darkAccent,
    primaryDark: darken(resolvedPrimary, 0.08),
    secondary: resolvedSecondary,
    blue50: warmSurfaceSoft,
    blue100: warmSurfaceStrong,
    blue500: resolvedSecondary,
    blue800: darkAccent,
    cardSoft: warmSurfaceSoft,
    homeHeaderBackground: warmSurfaceSoft,
    splashGradientStart: darkAccent,
    splashGradientEnd: darkBannerEnd,
    bannerGradientStart: darkAccent,
    bannerGradientEnd: darkBannerEnd,
    homeHeaderGradientStart: withAlpha(resolvedPrimary, 0.16),
    homeHeaderGradientEnd: withAlpha(resolvedSecondary, 0.22),
    yellow500: resolvedSecondary,
    storeMenuAccentLime: warmSurfaceStrong,
    storeMenuAccentOrange: mixColors(resolvedSecondary, resolvedTertiary, 0.2),
    findingRidePrimary: resolvedSecondary,
    findingRidePrimarySoft: warmSurfaceSoft,
    findingRidePulseA: lighten(resolvedSecondary, 0.52),
    findingRidePulseB: lighten(resolvedSecondary, 0.34),
    findingRidePulseC: resolvedSecondary,
    findingRideCenterHalo: withAlpha(resolvedSecondary, 0.34),
  };
}

const baseDarkColors: ThemeColors = {
  background: "#0F1117",
  backgroundTertiary: "#161A23",
  surface: "#161A23",
  primary: "#4C7DFF",
  primaryDark: "#2E4BC8",
  secondary: "#8B7BFF",
  text: "#F9FAFB",
  mutedText: "#9CA3AF",
  border: "#424244",
  success: "#34D399",
  successSoft: "#163326",
  successText: "#6EE7B7",
  warning: "#FBBF24",
  warningSoft: "#3A3412",
  warningText: "#FCD34D",
  danger: "#F87171",
  dangerSoft: "#3A1F1F",
  dangerText: "#FCA5A5",
  cardBlue: "#F1F5F9",
  cardMint: "#173A33",
  cardLavender: "#2A2348",
  cardPeach: "#3B2A1A",
  homeHeaderBackground: "#1E2130",
  cardSoft: "#1A2337",
  surfaceSoft: "#161A23",
  splashGradientStart: "#1440CE",
  splashGradientEnd: "#1E40AF",
  bannerGradientStart: "#1A46D6",
  bannerGradientEnd: "#1E40AF",
  homeHeaderGradientStart: "rgba(30, 64, 175, 0.25)",
  homeHeaderGradientEnd: "rgba(203, 215, 255, 0.15)",
  blue50: "#1A2337",
  blue100: "#1E2A44",
  blue500: "#60A5FA",
  blue800: "#1E40AF",
  green100: "#173A33",
  iconMuted: "#9CA3AF",
  iconDisabled: "#6B7280",
  overlayDark20: "rgba(0, 0, 0, 0.2)",
  shadowColor: "#000000",
  white: "#FFFFFF",
  iconColor: "#27272A",
  gray100: "#F3F4F6",
  findingRideSweepTrack: "#2A2D34",
  findingRideSweepEdge: "#F4F4F5",
  findingRideSweepCenter: "#0EA170",
  findingRidePrimary: "#4FC3E8",
  findingRidePrimarySoft: "#173847",
  findingRideMutedSurface: "#2A2D34",
  findingRideMutedText: "#A7AAB3",
  findingRideBorderSoft: "#343840",
  findingRideHandle: "#4A4F58",
  findingRidePulseA: "#265A6C",
  findingRidePulseB: "#1F6B84",
  findingRidePulseC: "#1691BF",
  findingRideCenterHalo: "rgba(22, 145, 191, 0.22)",
  findingRideMapOverlay: "rgba(15, 17, 23, 0.22)",
  yellow500: "#EAB308",
  red100: "#3B1F1F",
  storeHeroPrimary: "#007E27",
  storeHeroSecondary: "#044A25",
  storeHeroOverlay: "rgba(4, 74, 37, 0.3)",
  storeMenuAccentLime: "#88B11F",
  storeMenuAccentOrange: "#D85B2D",
  supportTicketHeaderBackground: "#111827",
};

// Keep app palettes isolated here. Add or override only the tokens each app needs.
const appColorOverrides: Record<ThemedMiniAppId, ThemeColorOverrideSet> = {
  general: {
    light: {
      background: "#FFFFFF",
      backgroundTertiary: "#F4F4F5",
      surface: "#FFFFFF",
      primary: "#2346E8",
      primaryDark: "#1C2FA6",
      secondary: "#6B5BFF",
    },
    dark: {
      background: "#0F1117",
      backgroundTertiary: "#161A23",
      surface: "#161A23",
      primary: "#4C7DFF",
      primaryDark: "#2E4BC8",
      secondary: "#8B7BFF",
    },
  },
  deliveries: {
    light: {
      background: "#FFFFFF",
      backgroundTertiary: "#F4F4F5",
      surface: "#FFFFFF",
      primary: "#2346E8",
      primaryDark: "#1C2FA6",
      secondary: "#6B5BFF",
    },
    dark: {
      background: "#0F1117",
      backgroundTertiary: "#161A23",
      surface: "#161A23",
      primary: "#4C7DFF",
      primaryDark: "#2E4BC8",
      secondary: "#8B7BFF",
    },
  },
  rideSharing: {
    light: {
      background: "#FFFFFF",
      backgroundTertiary: "#F4F4F5",
      surface: "#FFFFFF",
      primary: "#1691BF",
      primaryDark: "#1C2FA6",
      secondary: "#6B5BFF",
    },
    dark: {
      background: "#0F1117",
      backgroundTertiary: "#161A23",
      surface: "#161A23",
      primary: "#4FC3E8",
      primaryDark: "#2E4BC8",
      secondary: "#8B7BFF",
    },
  },
  homeVisits: {
    light: {
      background: "#FFFFFF",
      backgroundTertiary: "#F4F4F5",
      surface: "#FFFFFF",
      primary: "#2346E8",
      primaryDark: "#1C2FA6",
      secondary: "#6B5BFF",
    },
    dark: {
      background: "#0F1117",
      backgroundTertiary: "#161A23",
      surface: "#161A23",
      primary: "#4C7DFF",
      primaryDark: "#2E4BC8",
      secondary: "#8B7BFF",
    },
  },
  appointments: {
    light: {
      background: "#FFFFFF",
      backgroundTertiary: "#F4F4F5",
      surface: "#FFFFFF",
      primary: "#2346E8",
      primaryDark: "#1C2FA6",
      secondary: "#6B5BFF",
    },
    dark: {
      background: "#0F1117",
      backgroundTertiary: "#161A23",
      surface: "#161A23",
      primary: "#4C7DFF",
      primaryDark: "#2E4BC8",
      secondary: "#8B7BFF",
    },
  },
  developerMode: {
    light: {
      background: "#FFFFFF",
      backgroundTertiary: "#F4F4F5",
      surface: "#FFFFFF",
      primary: "#2346E8",
      primaryDark: "#1C2FA6",
      secondary: "#6B5BFF",
    },
    dark: {
      background: "#0F1117",
      backgroundTertiary: "#161A23",
      surface: "#161A23",
      primary: "#4C7DFF",
      primaryDark: "#2E4BC8",
      secondary: "#8B7BFF",
    },
  },
};

const resolvedThemeColorsCache = new Map<string, ThemeColors>();

export function resolveThemeColors(
  scheme: ThemeScheme,
  appId: ThemedMiniAppId = "general",
  deliveriesAppSettings?: DeliveriesAppSettings | null,
): ThemeColors {
  const dynamicDeliveriesSignature =
    appId === "deliveries"
      ? JSON.stringify({
          primary: normalizeHexColor(deliveriesAppSettings?.primary_color),
          secondary: normalizeHexColor(deliveriesAppSettings?.secondary_color),
          tertiary: normalizeHexColor(deliveriesAppSettings?.tertiary_color),
        })
      : "static";
  const cacheKey = `${scheme}:${appId}:${dynamicDeliveriesSignature}`;
  const cachedColors = resolvedThemeColorsCache.get(cacheKey);

  if (cachedColors) {
    return cachedColors;
  }

  const baseColors = scheme === "dark" ? baseDarkColors : baseLightColors;
  const mergedColors = Object.freeze({
    ...baseColors,
    ...appColorOverrides[appId][scheme],
    ...(appId === "deliveries"
      ? buildDeliveriesDynamicOverrides(scheme, deliveriesAppSettings)
      : {}),
  });

  resolvedThemeColorsCache.set(cacheKey, mergedColors);
  return mergedColors;
}

export const lightColors = resolveThemeColors("light");
export const darkColors = resolveThemeColors("dark");
