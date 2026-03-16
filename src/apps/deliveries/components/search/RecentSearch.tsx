import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from "../../../../general/components/Icon";
import { useTheme } from "../../../../general/theme/theme";
import Text from "../../../../general/components/Text";
import { typography } from "../../../../general/theme/typography";

// Todo: a reuseable resent search component can be used in multiple places
const RecentSearch = ({
  search,
  onDeletePress,
  onItemPress,
}: {
  search: string;
  onDeletePress: () => void;
  onItemPress: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onItemPress}
        style={styles.item}
        activeOpacity={0.7}
      >
        <Icon
          type="Ionicons"
          name="time-outline"
          size={20}
          color={colors.text}
        />
        <Text
          weight="medium"
          numberOfLines={1}
          style={{ fontSize: typography.size.sm2 }}
        >
          {search}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        hitSlop={12}
        onPress={onDeletePress}
        activeOpacity={0.7}
        style={styles.deleteButton}
      >
        <Icon type="Entypo" name="cross" size={20} color={colors.mutedText} />
      </TouchableOpacity>
    </View>
  );
};

export default RecentSearch;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 6,
  },
  item: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    gap: 12,
    paddingRight: 8,
  },
  deleteButton: {
    width: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
