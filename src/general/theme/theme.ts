import type { DeliveriesAppSettings } from '../stores/useAppConfigStore';
import { resolveThemeColors, type ThemeColors, type ThemedMiniAppId } from './colors';
import { typography } from './typography';

export type Theme = {
  isDark: boolean;
  colors: ThemeColors;
  typography: typeof typography;
};

export const buildTheme = (
  scheme: 'light' | 'dark' | null,
  activeMiniApp: ThemedMiniAppId = 'general',
  deliveriesAppSettings?: DeliveriesAppSettings | null,
): Theme => {
  const isDark = scheme === 'dark';
  return {
    isDark,
    colors: resolveThemeColors(
      isDark ? 'dark' : 'light',
      activeMiniApp,
      deliveriesAppSettings,
    ),
    typography,
  };
};

export const useTheme = (): Theme => {
  const context = require('./ThemeProvider').useAppTheme();
  return context.theme;
};
