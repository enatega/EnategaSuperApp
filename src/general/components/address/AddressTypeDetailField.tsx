import React, { memo } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Text from '../../components/Text';
import { useTheme } from '../../theme/theme';

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
};

function AddressTypeDetailField({
  label,
  placeholder,
  value,
  onChangeText,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Text weight="semiBold" style={styles.label}>
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
            fontSize: typography.size.md2,
          },
        ]}
        value={value}
      />
    </View>
  );
}

export default memo(AddressTypeDetailField);

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
  },
});
