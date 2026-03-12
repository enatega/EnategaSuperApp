import React from "react";
import { View } from "react-native";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import { styles } from "../styles";

interface StoreInfoProps {
  name: string;
}

export default function StoreInfo({ name }: StoreInfoProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.nameContainer}>
      <Text
        variant="subtitle"
        weight="semiBold"
        style={[styles.name, { color: colors.text }]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  );
}