import React from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { useTheme } from "../../../../../general/theme/theme";
import Text from "../../../../../general/components/Text";
import StoreCard from "../../../components/store-card/StoreCard";
import { useTranslation } from "react-i18next";
import { typography } from "../../../../../general/theme/typography";

interface Store {
  id: string;
  imageUrl?: string;
  offer?: string;
  name?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  cuisine?: string;
  price?: number;
  deliveryTime?: number;
  distance?: number;
}

interface StoreCardScrollerProps {
  title?: string;
  restaurants?: Store[];
  onSeeAllPress?: () => void;
  onRestaurantPress?: (restaurant: Store) => void;
}

// Demo data matching the screenshot
const DEMO_RESTAURANTS: Store[] = [
  {
    id: "1",
    offer: "25% off",
    name: "Hardee's",
    location: "Z Block",
    rating: 4.1,
    reviewCount: 5000,
    cuisine: "Fast Food",
    price: 2,
    deliveryTime: 30,
    distance: 1.7,
    imageUrl:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "2",
    offer: "Free Delivery",
    name: "McDonald's",
    location: "City Center",
    rating: 4.3,
    reviewCount: 8500,
    cuisine: "Burgers",
    price: 3,
    deliveryTime: 25,
    distance: 2.1,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg"
  },
  {
    id: "3",
    offer: "20% off",
    name: "Pizza Hut",
    location: "Main Boulevard",
    rating: 4.0,
    reviewCount: 3200,
    cuisine: "Pizza",
    price: 4,
    deliveryTime: 35,
    distance: 3.0,
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
];

const RestaurantCardScroller = ({
  title = "stores",
  restaurants = DEMO_RESTAURANTS,
  onSeeAllPress = () => console.log("see all pressed"),
  onRestaurantPress,
}: StoreCardScrollerProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation("deliveries");

  const renderRestaurant = ({ item }: { item: Store }) => (
    <View style={styles.cardWrapper}>
      <StoreCard
        imageUrl={item.imageUrl}
        offer={item.offer}
        name={item.name}
        location={item.location}
        rating={item.rating}
        reviewCount={item.reviewCount}
        cuisine={item.cuisine}
        price={item.price}
        deliveryTime={item.deliveryTime}
        distance={item.distance}
        onPress={() => onRestaurantPress?.(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
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

      {/* Horizontal FlatList with restaurant cards */}
      <FlatList
        data={restaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default RestaurantCardScroller;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  separator: {
    width: 16,
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cardWrapper: {
    // width: 280, // Fixed width for horizontal scrolling cards
  },
});
