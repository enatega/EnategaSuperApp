import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
};

export default function HomeVisitsSearchInput({
  value,
  onChangeText,
  placeholder,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Ionicons name="search" size={18} color={colors.mutedText} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        style={[
          styles.input,
          {
            color: colors.text,
            fontFamily: typography.fontFamily.regular,
          },
        ]}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
});
