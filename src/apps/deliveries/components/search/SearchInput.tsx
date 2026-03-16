import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useTheme } from "../../../../general/theme/theme";
import Icon from "../../../../general/components/Icon";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
}

export default function SearchInput({
  value,
  onChangeText,
  placeholder = "Search restaurants, stores, items",
  onClear,
  autoFocus = false,
}: SearchInputProps) {
  const { colors, typography } = useTheme();

  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.searchIconContainer}>
        <Ionicons name="search" color={colors.mutedText} size={20} />
      </View>

      <TextInput
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
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon type="Entypo" name="cross" size={16} color={colors.mutedText} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
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
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});
