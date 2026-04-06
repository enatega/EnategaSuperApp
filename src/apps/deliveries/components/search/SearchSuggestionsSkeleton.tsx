import React from "react";
import { StyleSheet, View } from "react-native";
import Skeleton from "../../../../general/components/Skeleton";
import type { SearchSuggestionsSkeletonProps } from "./types";

export default function SearchSuggestionsSkeleton(
  {}: SearchSuggestionsSkeletonProps,
) {
  return (
    <View style={styles.container}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton
          key={`search-chip-skeleton-${index}`}
          width={index % 3 === 0 ? 96 : index % 3 === 1 ? 74 : 118}
          height={32}
          borderRadius={999}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
