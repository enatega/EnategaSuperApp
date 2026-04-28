import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type DriverProfileTab = 'reviews' | 'info';

type Props = {
  activeTab: DriverProfileTab;
  onChangeTab: (tab: DriverProfileTab) => void;
  reviewsLabel: string;
  infoLabel: string;
};

export default function DriverProfileTabs({
  activeTab,
  onChangeTab,
  reviewsLabel,
  infoLabel,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.gray100 }]}>
      <Pressable
        onPress={() => onChangeTab('reviews')}
        style={[
          styles.tab,
          activeTab === 'reviews'
            ? { backgroundColor: colors.findingRidePrimary }
            : null,
        ]}
      >
        <Text
          weight="medium"
          style={[
            styles.tabLabel,
            {
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.sm2,
              color: activeTab === 'reviews' ? colors.white : colors.mutedText,
            },
          ]}
        >
          {reviewsLabel}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onChangeTab('info')}
        style={[
          styles.tab,
          activeTab === 'info'
            ? { backgroundColor: colors.findingRidePrimary }
            : null,
        ]}
      >
        <Text
          weight="medium"
          style={[
            styles.tabLabel,
            {
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.sm2,
              color: activeTab === 'info' ? colors.white : colors.mutedText,
            },
          ]}
        >
          {infoLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 6,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,

  },
  tabLabel: {
    textAlign: 'center',
  },
});
