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

export default function StoreRating({
  rating,
  reviewCount,
  cuisine,
}: StoreRatingProps) {
  const { colors } = useTheme();
  const hasRating = rating != null;
  const hasReviewCount = reviewCount != null;
  const hasCuisine = Boolean(cuisine);

  return (
    <View style={[styles.row, { justifyContent: "space-between" }]}>
      <View style={styles.row}>
        {hasRating && (
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
        )}

        {hasReviewCount && (
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
        )}
      </View>

      {hasCuisine && (
        <Text
          weight="medium"
          color={colors.mutedText}
          style={{ fontSize: 12, lineHeight: 18 }}
        >
          {cuisine}
        </Text>
      )}
    </View>
  );
}
