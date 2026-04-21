import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../../../../general/components/Text";
import { typography } from "../../../../general/theme/typography";
import { useTheme } from "../../../../general/theme/theme";
import ServicesCard from "../ServicesCard";
import { ServiceCardScrollerProps } from "./types";

export default function ServiceCardScroller({
  services,
  onSeeAllPress,
  onServicePress,
  onLoadMore,
  isLoadingMore,
  horizontal = true,
}: ServiceCardScrollerProps) {
  const { colors } = useTheme();
  const { t } = useTranslation("homeVisits");

  return (
    <>
      <View style={styles.header}>
        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
          }}
        >
          {t("services")}
        </Text>
        {onSeeAllPress ? (
          <TouchableOpacity
            style={[styles.seeAllButton, { backgroundColor: colors.blue100 }]}
            onPress={onSeeAllPress}
            activeOpacity={0.7}
          >
            <Text
              variant="body"
              weight="medium"
              style={{ color: colors.text, fontSize: typography.size.sm2 }}
            >
              {t("see_all")}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <FlatList
        data={services}
        renderItem={({ item }) => (
          <View style={{ paddingBottom: 12}}>
            <ServicesCard
              item={item}
              onPress={onServicePress ? () => onServicePress(item) : undefined}
              layout="fullWidth"
            />
          </View>
        )}
        horizontal={horizontal}
        keyExtractor={(item) => item.productId}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listContainer: {
    paddingVertical: 10,
  },
  separator: {
    width: 12,
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
});
