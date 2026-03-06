import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { useTheme } from "../../theme/theme";
import Icon, { IconType } from "../Icon";
import { useTranslation } from "react-i18next";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  iconName: string;
  iconType?: IconType;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  isPassword?: boolean;
  hasError?: boolean,
} & Omit<
  TextInputProps,
  "value" | "onChangeText" | "placeholder" | "onFocus" | "onBlur"
>;

export default function TextInputField({
  value,
  onChangeText,
  placeholder,
  iconName,
  iconType = "Feather",
  isFocused = false,
  onFocus,
  onBlur,
  isPassword = false,
  hasError= false,
  ...textInputProps
}: Props) {
  const { colors } = useTheme();
  const [isSecure, setIsSecure] = useState(isPassword);
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        { borderColor: hasError ? colors.danger : isFocused ? colors.primary : colors.border },
      ]}
    >
      <Icon
        type={iconType}
        name={iconName}
        size={20}
        color={colors.mutedText}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t(placeholder || "")}
        placeholderTextColor={colors.mutedText}
        secureTextEntry={isSecure}
        style={[styles.input, { color: colors.text }]}
        onFocus={onFocus}
        onBlur={onBlur}
        {...textInputProps}
      />
      {isPassword && (
        <TouchableOpacity hitSlop={12} onPress={() => setIsSecure(!isSecure)}>
          <Icon
            type="Feather"
            name={isSecure ? "eye" : "eye-off"}
            size={20}
            color={colors.mutedText}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
