import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, Platform, StatusBar, Image, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/theme';
import { resetToSharedRoute } from '../../navigation/rootNavigation';
import { useDeliveriesAppSettings } from '../../stores/useAppConfigStore';

type SwitcherKey = 'ride' | 'deliveries' | 'courier';

type AppSwitcherTopBarProps = {
  activeKey: SwitcherKey;
  rightAction?: React.ReactNode;
  expandedContent?: React.ReactNode;
  overlayOnMap?: boolean;
};

type SwitchOption = {
  key: SwitcherKey;
  label: string;
  icon: ImageSourcePropType;
};

const OPTIONS: SwitchOption[] = [
  { key: 'ride', label: 'Ride', icon: require('../../../apps/rideSharing/assets/images/3d-car.png') },
  { key: 'deliveries', label: 'Deliveries', icon: require('../../../apps/rideSharing/assets/images/3d-deliveries.png') },
  { key: 'courier', label: 'Courier', icon: require('../../../apps/rideSharing/assets/images/courierHomeIcon.png') },
];

function normalizeHexColor(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  const normalizedValue = trimmedValue.startsWith('#')
    ? trimmedValue
    : `#${trimmedValue}`;

  return /^#[0-9A-Fa-f]{6}$/.test(normalizedValue)
    ? normalizedValue.toUpperCase()
    : null;
}

function AppSwitcherTopBarComponent({
  activeKey,
  rightAction,
  expandedContent,
  overlayOnMap = false,
}: AppSwitcherTopBarProps) {
  const { colors, typography } = useTheme();
  const deliveriesAppSettings = useDeliveriesAppSettings();
  const insets = useSafeAreaInsets();
  const androidStatusBarHeight = StatusBar.currentHeight ?? 0;
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? androidStatusBarHeight : 0,
  );
  const switcherAccentBackground =
    normalizeHexColor(deliveriesAppSettings?.primary_color) ?? colors.primary;
  const switcherAccentBorder =
    normalizeHexColor(deliveriesAppSettings?.secondary_color) ?? colors.primaryDark;
  const switcherAccentText =
    normalizeHexColor(deliveriesAppSettings?.button_text_color) ?? colors.onPrimary;
  const topBackgroundColor = overlayOnMap ? 'transparent' : colors.background;

  if (__DEV__) {
    console.log('[AppSwitcherTopBar] Branding state', {
      activeKey,
      primary: colors.primary,
      onPrimary: colors.onPrimary,
      topBackgroundColor,
      overlayOnMap,
      deliveriesAppSettings,
    });
  }

  const handlePress = useCallback(
    (key: SwitcherKey) => {
      if (key === activeKey) {
        return;
      }

      if (key === 'deliveries') {
        resetToSharedRoute('Deliveries');
        return;
      }

      if (key === 'ride') {
        resetToSharedRoute('RideSharing', {
          screen: 'RideSharingHome',
          params: {
            rideType: 'now',
          },
        });
        return;
      }

      resetToSharedRoute('RideSharing', {
        screen: 'RideSharingHome',
        params: {
          rideType: 'courier',
        },
      });
    },
    [activeKey],
  );

  return (
    <View
      style={[
        styles.wrapper,
        overlayOnMap ? styles.wrapperOverlay : null,
        {
          paddingTop: topInset,
          backgroundColor: topBackgroundColor,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.tabsRow}>
          {OPTIONS.map((option) => {
            const isActive = option.key === activeKey;
            return (
              <Pressable
                accessibilityRole="button"
                key={option.key}
                onPress={() => handlePress(option.key)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isActive ? switcherAccentBackground : 'transparent',
                    borderColor: isActive ? switcherAccentBorder : 'transparent',
                  },
                ]}
              >
                <Image source={option.icon} style={styles.icon} />
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: isActive ? switcherAccentText : colors.text,
                      fontFamily: isActive
                        ? typography.fontFamily.semiBold
                        : typography.fontFamily.medium,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {rightAction ? <View style={styles.rightActionInline}>{rightAction}</View> : null}
      </View>
      {expandedContent ? (
        <View
          style={[
            styles.expandedContent,
            {
              backgroundColor: overlayOnMap ? topBackgroundColor : colors.surface,
            },
          ]}
        >
          {expandedContent}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    position: 'relative',
    paddingBottom: 8,
  },
  wrapperOverlay: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 50,
    elevation: 20,
  },
  container: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 4,
  },
  tabsRow: {
    flexDirection: 'row',
  },
  optionButton: {
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 999,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 14,
  },
  optionText: {
    fontSize: 14,
    lineHeight: 24,
  },
  icon: {
    height: 20,
    width: 20,
  },
  rightActionInline: {
    alignItems: 'center',
    height: 46,
    justifyContent: 'center',
    paddingLeft: 8,
    width: 48,
  },
  expandedContent: {
    paddingTop: 10,
    paddingBottom: 6,
  },
});

const AppSwitcherTopBar = memo(AppSwitcherTopBarComponent);
export default AppSwitcherTopBar;
