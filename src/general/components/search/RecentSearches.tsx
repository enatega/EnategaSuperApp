import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { ActivityIndicator } from "react-native";
import RecentSearch from "./RecentSearch";
import { useTranslation } from "react-i18next";
import Text from "../Text";
import { useTheme } from "../../theme/theme";
import { RecentSearchesProps } from "./types";

const RecentSearches = ({
  items,
  onDeletePress,
  onDeleteAllPress,
  onItemPress,
  deletingRecentSearchId,
  isDeletingRecentSearch,
  isClearingRecentSearches,
}: RecentSearchesProps) => {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();

  return (
    <View>
      <View style={styles.wrapper}>
        <View style={styles.headerContainer}>
          <Text
            weight="extraBold"
            style={{ fontSize: typography.size.h5, lineHeight: typography.lineHeight.h5 }}
          >
            {t("recent_searches")}
          </Text>
          <TouchableOpacity
            hitSlop={12}
            onPress={onDeleteAllPress}
            disabled={Boolean(isClearingRecentSearches || isDeletingRecentSearch)}
            activeOpacity={0.7}
          >
            {isClearingRecentSearches ? (
              <ActivityIndicator size="small" color={colors.blue800} />
            ) : (
              <Text
                color={colors.blue800}
                weight="medium"
                style={{ fontSize: typography.size.sm2, lineHeight: 22 }}
              >
                {t("clear_all")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={items}
        keyboardShouldPersistTaps="always"
        renderItem={({ item }) => (
          <RecentSearch
            search={item.term}
            onDeletePress={() => onDeletePress(item.id)}
            onItemPress={() => onItemPress(item.term)}
            isDeleting={deletingRecentSearchId === item.id}
            isDeleteDisabled={Boolean(isClearingRecentSearches)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};

export default RecentSearches;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 12,
  },
});
