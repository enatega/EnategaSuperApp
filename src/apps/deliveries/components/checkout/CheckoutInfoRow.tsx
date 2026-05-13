import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  subtitle?: string | null;
  subtitleRightAccessory?: React.ReactNode;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  onPress?: () => void;
  rightAccessory?: React.ReactNode;
};

export default function CheckoutInfoRow({
  title,
  subtitle,
  subtitleRightAccessory,
  iconName,
  onPress,
  rightAccessory,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { opacity: onPress && pressed ? 0.8 : 1 },
      ]}
    >
      <Ionicons color={colors.text} name={iconName} size={22} style={styles.icon} />

      <View style={styles.textWrap}>
        <Text
          weight="medium"
          style={{
            color: colors.text,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {title}
        </Text>

        {subtitle ? (
          <View style={styles.subtitleRow}>
            <Text
              style={{
                color: colors.mutedText,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {subtitle}
            </Text>
            {subtitleRightAccessory ?? null}
          </View>
        ) : null}
      </View>

      {rightAccessory ?? (
        <Ionicons color={colors.iconMuted} name="chevron-forward" size={20} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    width: 24,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  subtitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
});
