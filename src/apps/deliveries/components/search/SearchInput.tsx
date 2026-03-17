import React, { forwardRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../../general/theme/theme";
import Icon from "../../../../general/components/Icon";
import type { SearchInputProps } from "./types";

const SearchInput = forwardRef<TextInput, SearchInputProps>(
  function SearchInput(
    {
      value,
      onChangeText,
      placeholder = "Search restaurants, stores, items",
      onClear,
      onFocus,
      onBlur,
      onSubmitEditing,
      autoFocus = false,
    },
    ref,
  ) {
    const { colors, typography } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const handleClear = () => {
      onChangeText("");
      onClear?.();
    };

    const handleFocus: TextInputProps["onFocus"] = (event) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur: TextInputProps["onBlur"] = (event) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    return (
      <View
        style={[
          styles.focusRingContainer,
          {
            borderColor: isFocused ? colors.primary : "transparent",
          },
        ]}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: "#101828",
            },
          ]}
        >
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" color={colors.mutedText} size={20} />
          </View>

          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: colors.text,
                fontSize: typography.size.sm2,
                fontFamily: typography.fontFamily.regular,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={colors.mutedText}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={onSubmitEditing}
            autoFocus={autoFocus}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {value.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              hitSlop={12}
            >
              <Icon
                type="Entypo"
                name="cross"
                size={20}
                color={colors.mutedText}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);

export default SearchInput;

const styles = StyleSheet.create({
  focusRingContainer: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 1,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  searchIconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    lineHeight: 22,
  },
  clearButton: {
    marginLeft: 8,
  },
});
