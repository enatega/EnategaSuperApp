import React from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { useTheme } from "../../../../../general/theme/theme";
import Text from "../../../../../general/components/Text";
import ProductMiniCard from "../../../components/ProductMiniCard";
import { useTranslation } from "react-i18next";
import { typography } from "../../../../../general/theme/typography";

interface Product {
  id: string;
  name: string;
  imageUri?: string;
}

interface ProductMiniCardScrollerProps {
  title?: string;
  products?: Product[];
  onSeeAllPress?: () => void;
  onProductPress?: (product: Product) => void;
}

// Demo data for development
const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Pizza Margherita",
    imageUri: "https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=Pizza",
  },
  {
    id: "2",
    name: "Burger Deluxe",
    imageUri: "https://via.placeholder.com/100x100/4ECDC4/FFFFFF?text=Burger",
  },
  {
    id: "3",
    name: "Sushi Roll",
    imageUri: "https://via.placeholder.com/100x100/45B7D1/FFFFFF?text=Sushi",
  },
  {
    id: "4",
    name: "Pasta Carbonara",
    imageUri: "https://via.placeholder.com/100x100/F7DC6F/FFFFFF?text=Pasta",
  },
  {
    id: "5",
    name: "Chicken Wings",
    imageUri: "https://via.placeholder.com/100x100/BB8FCE/FFFFFF?text=Wings",
  },
  {
    id: "6",
    name: "Caesar Salad",
    imageUri: "https://via.placeholder.com/100x100/82E0AA/FFFFFF?text=Salad",
  },
];

const ProductMiniCardScroller = ({
  title = "products",
  products = DEMO_PRODUCTS,
  onSeeAllPress = () => console.log("see all pressed"),
  onProductPress,
}: ProductMiniCardScrollerProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation("deliveries");

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductMiniCard
      title={item.name}
      imageUri={item.imageUri}
      onPress={() => onProductPress?.(item)}
    />
  );

  return (
    <>
      {/* Header with title and see all button */}
      <View style={styles.header}>
        <Text variant="subtitle" weight="bold" style={{ color: colors.text }}>
          {t(title)}
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

      {/* Horizontal FlatList */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  },
  title: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 4,
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
