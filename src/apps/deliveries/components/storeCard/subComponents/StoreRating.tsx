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

  return (
    <View style={[styles.row, { justifyContent: "space-between" }]}>
      <View style={styles.row}>
        {rating && (
          <View style={styles.ratingContainer}>
            <Icon
              type="AntDesign"
              name="star"
              size={16}
              color={colors.yellow500}
            />
            <Text
              variant="body"
              weight="medium"
              style={[styles.rating, { color: colors.text }]}
            >
              {rating.toFixed(1)}
            </Text>
          </View>
        )}

        {reviewCount && (
          <Text
            variant="body"
            weight="regular"
            style={[styles.reviewCount, { color: colors.mutedText }]}
          >
            ({reviewCount.toLocaleString()}+)
          </Text>
        )}
      </View>

      {cuisine && (
        <Text variant="body" weight="medium" color={colors.mutedText}>
          {cuisine}
        </Text>
      )}
    </View>
  );
}
