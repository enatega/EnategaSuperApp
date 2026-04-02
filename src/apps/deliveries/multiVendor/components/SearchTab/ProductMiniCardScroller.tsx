import React from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { useTheme } from "../../../../../general/theme/theme";
import Text from "../../../../../general/components/Text";
import ProductCard from "../../../components/productCard/ProductCard";
import { useTranslation } from "react-i18next";
import { typography } from "../../../../../general/theme/typography";
import type { ProductMiniCardScrollerProps } from "./types";

const ProductMiniCardScroller = ({
  products,
  onSeeAllPress,
  onProductPress,
  onLoadMore,
  isLoadingMore,
}: ProductMiniCardScrollerProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation("deliveries");

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
          {t("products")}
        </Text>
        {onSeeAllPress && (
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
        )}
      </View>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            variant="mini"
            onPress={onProductPress ? () => onProductPress(item) : undefined}
          />
        )}
        keyExtractor={(item) => item.productId}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
      />
    </>
  );
};

export default ProductMiniCardScroller;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 1,
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
