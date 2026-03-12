import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import RecentSearch from "./RecentSearch";
import { useTranslation } from "react-i18next";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";

// Todo: a component which will use <RecentSearch/> and show recent searches
const RecentSearches = ({
  onDeleteAllPress,
}: {
  onDeleteAllPress: () => void;
}) => {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();

  const DEMO_RECENT_SEARCHES = [
    { id: "1", search: "pizza" },
    { id: "2", search: "burger" },
    { id: "3", search: "sushi" },
    { id: "4", search: "chinese food" },
    { id: "5", search: "italian restaurant" },
    { id: "6", search: "mexican tacos" },
    { id: "7", search: "thai curry" },
    { id: "8", search: "indian food" },
  ];

  const handleDeletePress = (id: string) => {
    console.log(`delete pressed for item ${id}`);
    // Here you would typically remove the item from your data array
  };

  const handleItemPress = (search: string) => {
    console.log(`item pressed: ${search}`);
    // Here you would typically navigate to search results or perform a search
  };

  const renderItem = ({ item }: { item: (typeof DEMO_RECENT_SEARCHES)[0] }) => (
    <RecentSearch
      search={item.search}
      onDeletePress={() => handleDeletePress(item.id)}
      onItemPress={() => handleItemPress(item.search)}
    />
  );

  return (
    <View>
      <View style={styles.wrapper}>
        <View style={styles.headerContainer}>
          <Text variant="body" weight="bold">
            {t("recent_searches")}
          </Text>

          <TouchableOpacity
            hitSlop={12}
            onPress={onDeleteAllPress}
            activeOpacity={0.7}
          >
            <Text
              color={colors.blue800}
              style={{ fontSize: typography.size.sm2 }}
            >
              {t("clear_all")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <RecentSearch
        search="pizza"
        onDeletePress={() => console.log("delete pressed")}
        onItemPress={() => console.log("item pressed")}
      />
      <RecentSearch
        search="burger"
        onDeletePress={() => console.log("delete pressed")}
        onItemPress={() => console.log("item pressed")}
      /> */}

      <FlatList
        data={DEMO_RECENT_SEARCHES}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id}
        showsVerticalScrollIndicator={false}
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
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
});
