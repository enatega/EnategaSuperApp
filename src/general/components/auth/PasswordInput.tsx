import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../theme/theme";
import Icon from "../Icon";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function PasswordInput({
  value,
  onChangeText,
  placeholder = "Password",
  isFocused = false,
  onFocus,
  onBlur,
}: Props) {
  const { colors } = useTheme();
  const [isSecure, setIsSecure] = useState(true);

  return (
    <View
      style={[
        styles.container,
        { borderColor: isFocused ? colors.primary : colors.border },
      ]}
    >
      <Icon type="Feather" name="lock" size={20} color={colors.mutedText} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        secureTextEntry={isSecure}
        autoCapitalize="none"
        style={[styles.input, { color: colors.text }]}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <TouchableOpacity hitSlop={12} onPress={() => setIsSecure(!isSecure)}>
        <Icon
          type="Feather"
          name={isSecure ? "eye" : "eye-off"}
          size={20}
          color={colors.mutedText}
        />
      </TouchableOpacity>
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
