import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  countLabel: string;
  durationLabel: string | null;
  insets: EdgeInsets;
  isLoading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  totalLabel: string;
  buttonLabel: string;
  buttonStyle?: StyleProp<ViewStyle>;
  subtitleLabel?: string | null;
};

export default function AppointmentBookingFooter({
  buttonLabel,
  buttonStyle,
  countLabel,
  disabled = false,
  durationLabel,
  insets,
  isLoading = false,
  onPress,
  subtitleLabel,
  totalLabel,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom + 12,
        },
      ]}
    >
      <View style={styles.summary}>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
          }}
          weight="extraBold"
        >
          {totalLabel}
        </Text>
        {subtitleLabel ? (
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {subtitleLabel}
          </Text>
        ) : null}
        <View style={styles.meta}>
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {countLabel}
          </Text>
          {durationLabel ? (
            <>
              <Text style={{ color: colors.mutedText, fontSize: typography.size.sm2 }}>•</Text>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                }}
              >
                {durationLabel}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      <View style={styles.action}>
        <Button
          disabled={disabled}
          isLoading={isLoading}
          label={buttonLabel}
          onPress={onPress}
          style={[styles.button, buttonStyle]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    flex: 1,
  },
  button: {
    minHeight: 56,
  },
  container: {
    alignItems: 'center',
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    gap: 16,
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
  },
  meta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  summary: {
    flex: 1,
    gap: 4,
  },
});
