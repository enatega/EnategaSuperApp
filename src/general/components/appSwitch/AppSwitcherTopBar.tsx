import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, Platform, StatusBar, Image, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/theme';
import { resetToSharedRoute } from '../../navigation/rootNavigation';

type SwitcherKey = 'ride' | 'deliveries' | 'courier';

type AppSwitcherTopBarProps = {
  activeKey: SwitcherKey;
  rightAction?: React.ReactNode;
  expandedContent?: React.ReactNode;
};

type SwitchOption = {
  key: SwitcherKey;
  label: string;
  icon: ImageSourcePropType;
};

const OPTIONS: SwitchOption[] = [
  { key: 'ride', label: 'Ride', icon: require('../../assets/images/car-tab.png') },
  { key: 'deliveries', label: 'Deliveries', icon: require('../../assets/images/delivery-tab.png') },
  { key: 'courier', label: 'Courier', icon: require('../../assets/images/courier-tab.png') },
];

function AppSwitcherTopBarComponent({ activeKey, rightAction, expandedContent }: AppSwitcherTopBarProps) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const androidStatusBarHeight = StatusBar.currentHeight ?? 0;
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? androidStatusBarHeight : 0,
  );

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
          directCourierOnly: true,
        },
      });
    },
    [activeKey],
  );

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.surface, paddingTop: topInset }]}>
      <View style={[styles.container, { borderColor: colors.border }]}>
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
                    backgroundColor: isActive ? colors.blue50 : 'transparent',
                    borderBottomColor: isActive ? colors.blue800 : 'transparent',
                  },
                ]}
              >
                <Image source={option.icon} style={styles.icon} />
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: isActive ? colors.blue800 : '#374151',
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
              borderColor: colors.border,
              backgroundColor: colors.surface,
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
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: "hidden",
  },
  container: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 46,
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
  },
  optionButton: {
    alignItems: 'center',
    borderBottomWidth: 3,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  icon: {
    height: 16,
    width: 16,
  },
  rightActionInline: {
    alignItems: 'center',
    height: 46,
    justifyContent: 'center',
    paddingLeft: 8,
    width: 48,
  },
  expandedContent: {
    // borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
    paddingTop: 8,
    paddingBottom: 8,
  },
});

const AppSwitcherTopBar = memo(AppSwitcherTopBarComponent);
export default AppSwitcherTopBar;
