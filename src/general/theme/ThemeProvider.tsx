import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAppConfigStore } from '../stores/useAppConfigStore';
import { buildTheme, Theme } from './theme';
import type { ThemedMiniAppId } from './colors';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  themeMode: ThemeMode;
  activeMiniApp: ThemedMiniAppId;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setActiveMiniApp: (appId: ThemedMiniAppId) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);



export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const THEME_STORAGE_KEY = 'super_app_theme_mode';
  const systemScheme = useColorScheme();
  const deliveriesAppSettings = useAppConfigStore((state) => state.deliveries.appSettings);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [activeMiniApp, setActiveMiniAppState] = useState<ThemedMiniAppId>('general');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
       console.log('Loaded theme mode from storage:');
    SecureStore.getItemAsync(THEME_STORAGE_KEY)
      .then((savedMode: string | null) => {
     
        if (savedMode && ['system', 'light', 'dark'].includes(savedMode)) {
          setThemeModeState(savedMode as ThemeMode);
        }
      }).catch((error) => {
        console.error('Error loading theme mode from storage:', error);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    console.log('Setting theme mode to:', mode);
    setThemeModeState(mode);
    await SecureStore.setItemAsync(THEME_STORAGE_KEY, mode);
  };

  const setActiveMiniApp = useCallback((appId: ThemedMiniAppId) => {
    setActiveMiniAppState((currentAppId) => (currentAppId === appId ? currentAppId : appId));
  }, []);

  const activeScheme =
    themeMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themeMode;

  const theme = useMemo(
    () => buildTheme(activeScheme, activeMiniApp, deliveriesAppSettings),
    [activeMiniApp, activeScheme, deliveriesAppSettings],
  );

  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    console.log('[ThemeProvider] Active theme state', {
      activeMiniApp,
      activeScheme,
      themeMode,
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      onPrimary: theme.colors.onPrimary,
      deliveriesAppSettings,
    });
  }, [activeMiniApp, activeScheme, deliveriesAppSettings, theme, themeMode]);

  const value = useMemo(
    () => ({ theme, themeMode, activeMiniApp, setThemeMode, setActiveMiniApp }),
    [activeMiniApp, theme, themeMode, setActiveMiniApp]
  );

  if (!isLoaded) return null; // Avoid a rendering flash of wrong theme

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}
