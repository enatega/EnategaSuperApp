import React, { useState } from "react";
import { Keyboard, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../../general/theme/theme";
import Text from "../../../../../general/components/Text";
import SearchHeader from "../../../components/seeAllHeader/SearchHeader";
import TopBrandsSeeAllContainer from "../../components/TopBrandsSeeAll/TopBrandsSeeAllContainer";

export default function TopBrandsSeeAll() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation("deliveries");
  const [searchValue, setSearchValue] = useState("");

  return (
    <Pressable
      style={[styles.screen, { backgroundColor: colors.background }]}
      onPress={() => Keyboard.dismiss()}
    >
      <SearchHeader
        searchPlaceholder={t("store_details_search_placeholder")}
        searchValue={searchValue}
        onSearchChangeText={setSearchValue}
        isSearchEditable
        backAccessibilityLabel={t("support_back_action")}
        filterAccessibilityLabel={t("store_details_search_placeholder")}
        mapAccessibilityLabel={t("store_details_search_placeholder")}
        isSearchVisible
        isFilterVisible={false}
        isMapVisible={false}
      />
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
        {t("multi_vendor_all_brands_title")}
      </Text>
      <TopBrandsSeeAllContainer searchValue={searchValue} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  screen: { flex: 1 },
});
