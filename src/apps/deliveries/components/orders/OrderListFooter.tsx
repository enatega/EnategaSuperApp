import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";

type Props = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isVisible: boolean;
  onLoadMore: () => void;
  loadMoreLabel: string;
  noMoreItemsLabel: string;
  showEndLabel?: boolean;
};

const OrderListFooter = ({
  hasNextPage,
  isFetchingNextPage,
  isVisible,
  onLoadMore,
  loadMoreLabel,
  noMoreItemsLabel,
  showEndLabel = true,
}: Props) => {
  const { colors, typography } = useTheme();

  if (!isVisible) {
    return null;
  }

  if (isFetchingNextPage) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          color={colors.primary}
          size="small"
        />
      </View>
    );
  }

  if (hasNextPage) {
    return (
      <Pressable
        accessibilityRole="button"
        hitSlop={10}
        onPress={onLoadMore}
        style={styles.container}
      >
        <Text
          weight="medium"
          style={{
            color: colors.primary,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {loadMoreLabel}
        </Text>
      </Pressable>
    );
  }

  if (!showEndLabel) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text
        weight="medium"
        style={{
          color: colors.mutedText,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {noMoreItemsLabel}
      </Text>
    </View>
  );
};

export default OrderListFooter;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
});
