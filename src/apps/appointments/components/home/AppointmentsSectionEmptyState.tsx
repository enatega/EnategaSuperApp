import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  message: string;
};

export default function AppointmentsSectionEmptyState({
  title,
  message,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundTertiary,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.blue50 }]}>
        <MaterialCommunityIcons
          color={colors.primary}
          name="calendar-blank-outline"
          size={28}
        />
      </View>
      <Text
        weight="semiBold"
        style={{
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.sm2,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        color={colors.mutedText}
        style={{
          fontSize: typography.size.xs2,
          lineHeight: typography.lineHeight.sm,
          maxWidth: 240,
          textAlign: 'center',
        }}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
    justifyContent: 'center',
    minHeight: 176,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 999,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
});
