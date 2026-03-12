import React from "react";
import { View, StyleSheet } from "react-native";
import SearchChip from "./SearchChip";

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionPress: (suggestion: string) => void;
}

// Demo data matching your screenshot
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

export default function SearchSuggestions({
  suggestions = DEMO_SUGGESTIONS,
  onSuggestionPress,
}: SearchSuggestionsProps) {
  return (
    <View style={styles.wrapContainer}>
      {suggestions.map((suggestion, index) => (
        <View key={`${suggestion}-${index}`}>
          <SearchChip label={suggestion} onPress={onSuggestionPress} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
});
