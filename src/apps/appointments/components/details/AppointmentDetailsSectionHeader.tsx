import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  actionLabel?: string;
  onPress?: () => void;
};

export default function AppointmentDetailsSectionHeader({
  title,
  actionLabel,
  onPress,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.header}>
      <Text
        style={{
          color: colors.text,
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.lg,
        }}
        weight="extraBold"
      >
        {title}
      </Text>

      {actionLabel && onPress ? (
        <Pressable onPress={onPress}>
          <Text
            style={{ color: colors.mutedText, fontSize: typography.size.sm }}
            weight="semiBold"
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
