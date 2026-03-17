import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
};

export default function RatingCommentInput({ value, placeholder, onChangeText }: Props) {
  const { colors } = useTheme();

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.mutedText}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      style={[
        styles.input,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.text,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    minHeight: 112,
    padding: 12,
  },
});
