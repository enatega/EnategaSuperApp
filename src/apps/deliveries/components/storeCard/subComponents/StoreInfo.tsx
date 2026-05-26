import React from "react";
import { View } from "react-native";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import { styles } from "../styles";

interface StoreInfoProps {
  name: string;
  rightLabel?: string;
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

export default function StoreInfo({ name, rightLabel }: StoreInfoProps) {
  const { colors } = useTheme();
  const resolvedRightLabel = rightLabel ? decodeDisplayText(rightLabel) : undefined;

  return (
    <View
      style={[
        styles.nameContainer,
        rightLabel ? { flexDirection: 'row', justifyContent: 'space-between', gap: 8 } : null,
      ]}
    >
      <Text
        variant="subtitle"
        weight="semiBold"
        style={[styles.name, { color: colors.text, flexShrink: 1 }]}
        numberOfLines={1}
      >
        {name}
      </Text>

      {resolvedRightLabel ? (
        <Text
          weight="medium"
          color={colors.mutedText}
          style={{ fontSize: 12, lineHeight: 18, flexShrink: 0 }}
          numberOfLines={1}
        >
          {resolvedRightLabel}
        </Text>
      ) : null}
    </View>
  );
}
