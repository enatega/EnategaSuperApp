import React from "react";
import { View, StyleSheet } from "react-native";
import SearchChip from "./SearchChip";
import type { SearchRecommendation } from "../../api/searchServiceTypes";
import { SearchSuggestionsProps } from "./types";


export default function SearchSuggestions({
  recommendations,
  onSuggestionPress,
}: SearchSuggestionsProps) {
  return (
    <View style={styles.wrapContainer}>
      {recommendations?.map((item) => (
        <View key={item?.id}>
          <SearchChip label={item?.name} onPress={onSuggestionPress} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
