import React from "react";
import { View } from "react-native";
import Icon from "../../../../../general/components/Icon";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import { styles } from "../styles";

interface StoreRatingProps {
  rating?: number;
  reviewCount?: number;
  cuisine?: string;
}

function hasVisibleRating(rating?: number, reviewCount?: number) {
  const hasPositiveRating =
    typeof rating === "number" && Number.isFinite(rating) && rating > 0;
  const hasPositiveReviewCount =
    typeof reviewCount === "number" &&
    Number.isFinite(reviewCount) &&
    reviewCount > 0;

  return hasPositiveRating || hasPositiveReviewCount;
}

function decodeDisplayText(value: string) {
  let decodedValue = value;

  if (decodedValue.includes('%')) {
    try {
      decodedValue = decodeURIComponent(decodedValue);
    } catch {
      decodedValue = value;
    }
  }

  return decodedValue.replaceAll('&amp;', '&');
}

export default function StoreRating({
  rating,
  reviewCount,
  cuisine,
}: StoreRatingProps) {
  const { colors } = useTheme();
  const shouldShowRatingBlock = hasVisibleRating(rating, reviewCount);
  const hasRating = typeof rating === "number" && Number.isFinite(rating) && rating > 0;
  const hasReviewCount =
    typeof reviewCount === "number" &&
    Number.isFinite(reviewCount) &&
    reviewCount > 0;
  const hasCuisine = Boolean(cuisine);
  const resolvedCuisine = cuisine ? decodeDisplayText(cuisine) : undefined;

  return (
    <View
      style={[
        styles.row,
        { justifyContent: shouldShowRatingBlock ? "space-between" : "flex-start" },
      ]}
    >
      <View style={styles.row}>
        {shouldShowRatingBlock && hasRating ? (
          <View style={styles.ratingContainer}>
            <Icon
              type="AntDesign"
              name="star"
              size={14}
              color={colors.yellow500}
            />
            <Text
              weight="semiBold"
              style={[styles.rating, { color: colors.text }]}
            >
              {rating.toFixed(1)}
            </Text>
          </View>
        ) : null}

        {shouldShowRatingBlock && hasReviewCount ? (
          <Text
            weight="regular"
            style={[
              styles.reviewCount,
              {
                color: colors.mutedText,
                fontSize: 12,
                lineHeight: 18,
              },
            ]}
          >
            ({reviewCount.toLocaleString()}+)
          </Text>
        ) : null}
      </View>

      {hasCuisine && (
        <Text
          weight="medium"
          color={colors.mutedText}
          style={{
            fontSize: 12,
            lineHeight: 18,
            marginLeft: shouldShowRatingBlock ? 0 : 4,
          }}
        >
          {resolvedCuisine}
        </Text>
      )}
    </View>
  );
}
