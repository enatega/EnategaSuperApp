import React, { forwardRef, useMemo, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  type TextInputProps,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/theme";
import Icon from "../Icon";
import { SearchInputProps } from "./types";


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
      editable = true,
      style,
    },
    ref,
  ) {
    const { colors, typography } = useTheme();
    const { width } = useWindowDimensions();
    const [isFocused, setIsFocused] = useState(false);
    const isCompactWidth = width < 360;
    const isLargeWidth = width >= 768;
    const metrics = useMemo(
      () => ({
        borderRadius: isLargeWidth ? 10 : isCompactWidth ? 6 : 8,
        clearButtonSize: isLargeWidth ? 36 : isCompactWidth ? 28 : 32,
        fontSize: isLargeWidth
          ? typography.size.md
          : isCompactWidth
            ? typography.size.sm
            : typography.size.sm2,
        horizontalPadding: isLargeWidth ? 14 : isCompactWidth ? 10 : 12,
        iconSize: isLargeWidth ? 22 : isCompactWidth ? 18 : 20,
        minHeight: isLargeWidth ? 52 : isCompactWidth ? 44 : 48,
      }),
      [isCompactWidth, isLargeWidth, typography.size.md, typography.size.sm, typography.size.sm2],
    );

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
            borderRadius: metrics.borderRadius + 2,
            borderColor: isFocused ? colors.primary : "transparent",
            width: "100%",
          },
          style, // Apply custom style to the outer container
        ]}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: "#101828",
              borderRadius: metrics.borderRadius,
              height: metrics.minHeight,
              paddingHorizontal: metrics.horizontalPadding,
            },
          ]}
        >
          <View style={styles.searchIconContainer}>
            <Ionicons
              name="search"
              color={colors.mutedText}
              size={metrics.iconSize}
            />
          </View>

          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: colors.text,
                fontSize: metrics.fontSize,
                fontFamily: typography.fontFamily.regular,
                textAlignVertical: "center",
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
            editable={editable}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="never"
          />

          {value.length > 0 && (
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={handleClear}
              style={[
                styles.clearButton,
                {
                  height: metrics.clearButtonSize,
                  width: metrics.clearButtonSize,
                },
              ]}
            >
              <Icon
                type="Entypo"
                name="cross"
                size={metrics.iconSize}
                color={colors.mutedText}
              />
            </Pressable>
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
    padding: 1,
  },
  container: {
    alignItems: "center",
    borderWidth: 1,
    flexDirection: "row",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    width: "100%",
  },
  searchIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    width: 20,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
  },
  clearButton: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
