import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../../../../general/components/Button';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { formatPrice } from '../ServiceDetailsPage/serviceDetailsSelection';

type Props = {
  totalPrice: number;
  serviceCountLabel: string;
  durationLabel: string | null;
  workersLabel: string;
  continueLabel: string;
  bottomInset: number;
  disabled?: boolean;
  onContinue: () => void;
};

function TeamAndScheduleFooter({
  bottomInset,
  continueLabel,
  disabled = false,
  durationLabel,
  onContinue,
  serviceCountLabel,
  totalPrice,
  workersLabel,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: Math.max(bottomInset, 12),
        },
      ]}
    >
      <View style={styles.footerRow}>
        <View style={styles.footerMeta}>
          <Text
            weight="bold"
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {formatPrice(totalPrice)}
          </Text>

          <View style={styles.footerMetaLine}>
            <Text
              weight="medium"
              style={{
                color: colors.mutedText,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {serviceCountLabel}
            </Text>

            {durationLabel ? (
              <>
                <Icon type="Entypo" name="dot-single" size={14} color={colors.iconMuted} />
                <Text
                  weight="medium"
                  style={{
                    color: colors.mutedText,
                    fontSize: typography.size.xs2,
                    lineHeight: typography.lineHeight.sm,
                  }}
                >
                  {durationLabel}
                </Text>
              </>
            ) : null}

            <Icon type="Entypo" name="dot-single" size={14} color={colors.iconMuted} />
            <Text
              weight="medium"
              style={{
                color: colors.mutedText,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {workersLabel}
            </Text>
          </View>
        </View>

        <View style={styles.footerAction}>
          <Button
            disabled={disabled}
            label={continueLabel}
            labelStyle={{
              color: colors.white,
              fontSize: typography.size.lg,
              lineHeight: typography.lineHeight.md,
            }}
            onPress={onContinue}
            style={{
              backgroundColor: colors.warning,
              borderColor: colors.warning,
              borderRadius: 14,
              minHeight: 56,
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default memo(TeamAndScheduleFooter);

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
  },
  footerAction: {
    flex: 1,
  },
  footerMeta: {
    flex: 1,
    gap: 2,
  },
  footerMetaLine: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
});
