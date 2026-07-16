import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { HomeVisitsSingleVendorBookingsTab } from '../../api/types';

type Props = {
  activeTab: HomeVisitsSingleVendorBookingsTab;
  ongoingLabel: string;
  pastLabel: string;
  onTabChange: (tab: HomeVisitsSingleVendorBookingsTab) => void;
};

export default function BookingsTabs({
  activeTab,
  ongoingLabel,
  pastLabel,
  onTabChange,
}: Props) {
  const { colors, typography } = useTheme();
  const activeBackgroundColor = colors.primary;
  const inactiveTextColor = colors.iconMuted;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundTertiary,
          borderColor: colors.border,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: activeTab === 'ongoing' }}
        onPress={() => onTabChange('ongoing')}
        style={[
          styles.tabButton,
          activeTab === 'ongoing' && styles.activeTabButton,
          activeTab === 'ongoing' && { backgroundColor: activeBackgroundColor },
        ]}
      >
        <Text
          style={[
            styles.tabLabel,
            {
              color: activeTab === 'ongoing' ? colors.white : inactiveTextColor,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md2,
            },
          ]}
          weight={activeTab === 'ongoing' ? 'semiBold' : 'medium'}
        >
          {ongoingLabel}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: activeTab === 'past' }}
        onPress={() => onTabChange('past')}
        style={[
          styles.tabButton,
          activeTab === 'past' && styles.activeTabButton,
          activeTab === 'past' && { backgroundColor: activeBackgroundColor },
        ]}
      >
        <Text
          style={[
            styles.tabLabel,
            {
              color: activeTab === 'past' ? colors.white : inactiveTextColor,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md2,
            },
          ]}
          weight={activeTab === 'past' ? 'semiBold' : 'medium'}
        >
          {pastLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  activeTabButton: {
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  container: {
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    height: 54,
    marginBottom: 10,
    padding: 6,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
  },
  tabLabel: {
    letterSpacing: 0,
  },
});
