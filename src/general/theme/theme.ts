import { useColorScheme } from 'react-native';
import { darkColors, lightColors, ThemeColors } from './colors';
import { typography } from './typography';

export type Theme = {
  isDark: boolean;
  colors: ThemeColors;
  typography: typeof typography;
};

export const buildTheme = (scheme: 'light' | 'dark' | null): Theme => {
  const isDark = scheme === 'dark';
  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
    typography,
  };
};

export const useTheme = (): Theme => {
  const scheme = useColorScheme();
  return buildTheme(scheme);
};
