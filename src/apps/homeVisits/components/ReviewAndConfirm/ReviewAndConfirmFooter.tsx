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
  bottomInset: number;
  buttonLabel: string;
  onConfirm: () => void;
};

function ReviewAndConfirmFooter({
  bottomInset,
  buttonLabel,
  durationLabel,
  onConfirm,
  serviceCountLabel,
  totalPrice,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: Math.max(bottomInset, 10),
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
                color: colors.iconMuted,
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
                    color: colors.iconMuted,
                    fontSize: typography.size.xs2,
                    lineHeight: typography.lineHeight.sm,
                  }}
                >
                  {durationLabel}
                </Text>
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.footerAction}>
          <Button
            label={buttonLabel}
            onPress={onConfirm}
            style={{
              backgroundColor: colors.warning,
              borderColor: colors.warning,
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default memo(ReviewAndConfirmFooter);

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
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
});
