import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useTheme } from "../../theme/theme";
import Icon, { IconType } from "../Icon";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  type?: IconType;
  iconName?: string;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function NameInput({
  value,
  onChangeText,
  placeholder = "Name",
  iconName = "user",
  isFocused = false,
  type = "Feather",
  onFocus,
  onBlur,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderColor: isFocused ? colors.primary : colors.border }]}>
      <Icon type={type} name={iconName} size={20} color={colors.mutedText} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        style={[styles.input, { color: colors.text }]}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
