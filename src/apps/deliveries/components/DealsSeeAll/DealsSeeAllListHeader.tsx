import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import type { DeliveryDealsTabType } from "../../api/dealsServiceTypes";

type Props = {
  onTabChange: (tab: DeliveryDealsTabType) => void;
  selectedTab: DeliveryDealsTabType;
  title: string;
};

export default function DealsSeeAllListHeader({
  onTabChange,
  selectedTab,
  title,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation("deliveries");
  const tabs: Array<{ key: DeliveryDealsTabType; label: string }> = [
    { key: "all", label: t("deals_see_all_tab_all") },
    { key: "limited", label: t("deals_see_all_tab_limited") },
    { key: "weekly", label: t("deals_see_all_tab_weekly") },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        {tabs.map((tab, index) => {
          const isSelected = selectedTab === tab?.key;

          return (
            <Pressable
              key={tab.key}
              accessibilityRole="button"
              onPress={() => onTabChange(tab.key)}
              style={[
                styles.tabButton,
                index === 0
                  ? styles.tabButtonFirst
                  : index === 1
                    ? styles.tabButtonMiddle
                    : styles.tabButtonLast,
                {
                  borderBottomColor: isSelected
                    ? colors.blue800
                    : "transparent",
                  backgroundColor: isSelected ? colors.blue100 : "transparent",
                },
              ]}
            >
              <Text
                weight={isSelected ? "semiBold" : "regular"}
                style={{
                  color: isSelected ? colors.blue800 : colors.mutedText,
                  fontSize: typography.size.md,
                  lineHeight: typography.lineHeight.md,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text
        weight="bold"
        style={[
          styles.title,
          {
            color: colors.text,
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  tabButton: {
    alignItems: "center",
    borderBottomWidth: 3,
    justifyContent: "center",
    paddingBottom: 14,
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  tabButtonFirst: {
    minWidth: 66,
  },
  tabButtonLast: {
    minWidth: 116,
  },
  tabButtonMiddle: {
    minWidth: 150,
  },
  tabsRow: {
    borderBottomColor: "rgba(17, 24, 39, 0.12)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 14,
  },
});
