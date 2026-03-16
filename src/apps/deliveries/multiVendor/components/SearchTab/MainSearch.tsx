import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../../components/search/SearchInput";
import SearchSuggestions from "../../../components/search/SearchSuggestions";
import Svg from "../../../components/Svg";
import EmptySearch from "../../../components/search/EmptySearch";
import ProductMiniCardScroller from "./ProductMiniCardScroller";
import StoreCardScroller from "./StoreCardScroller";
import RecentSearch from "../../../components/search/RecentSearch";
import RecentSearches from "../../../components/search/RecentSearches";

// Todo: a reuseable component for search functionality
export default function MainSearch() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation("deliveries");

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion); // Updates search input
    // Optionally trigger search here
  };

  const DEMO_SUGGESTIONS = [
    "Pizza",
    "Burger",
    "Asian",
    "Pasta",
    "Italian",
    "Sushi",
    "French",
    "Vegan",
    "Chinese",
    "African",
    "Fish",
    "Gluten-free",
    "Ice cream",
    "Sandwich",
    "Wings",
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t("search_input_placeholder")}
        onClear={() => console.log("Search cleared")}
      />

      <RecentSearches
        onDeleteAllPress={() => console.log("delete all pressed")}
      />

      {/* searching near bar */}
      <View style={[styles.searchingNear]}>
        <Text color={colors.text} variant="caption">
          {t("searching_near")}
        </Text>
      </View>

      <ScrollView>
        <SearchSuggestions
          suggestions={DEMO_SUGGESTIONS}
          onSuggestionPress={handleSuggestionPress}
        />
        <EmptySearch />
        <ProductMiniCardScroller />
        <StoreCardScroller />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchingNear: {
    marginVertical: 12,
  },
});
