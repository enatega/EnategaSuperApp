import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { TransactionFilter } from '../../types/wallet';

type TabItem = {
  key: TransactionFilter;
  label: string;
};

type Props = {
  tabs: TabItem[];
  activeTab: TransactionFilter;
  onTabChange: (tab: TransactionFilter) => void;
};

export default function TransactionFilterTabs({ tabs, activeTab, onTabChange }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={[
              styles.tab,
              isActive
                ? { backgroundColor: colors.findingRidePrimarySoft }
                : { borderWidth: 1, borderColor: colors.border },
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              variant="caption"
              weight="medium"
              color={isActive ? colors.findingRidePrimary : colors.mutedText}
              style={styles.tabText}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
