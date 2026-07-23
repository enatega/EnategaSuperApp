import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from '../../../../general/components/Icon';
import type { EdgeInsets } from 'react-native-safe-area-context';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  insets: EdgeInsets;
  onBackPress: () => void;
};

export default function AppointmentBookingHeader({
  insets,
  onBackPress,
  title,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 10,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onBackPress}
        style={[styles.backButton, { backgroundColor: colors.surfaceSoft }]}
      >
        <Icon color={colors.text} name="chevron-back" size={20} />
      </Pressable>

      <Text
        weight="semiBold"
        style={{
          color: colors.text,
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.lg,
        }}
      >
        {title}
      </Text>

      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  spacer: {
    width: 40,
  },
});
