import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../../general/components/Button';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  durationLabel: string | null;
  onBookService: () => void;
  serviceCount: number;
  serviceCountLabel: string;
  totalPrice: string | null;
};

export default function ServiceDetailsFooter({
  durationLabel,
  onBookService,
  serviceCount,
  serviceCountLabel,
  totalPrice,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <View style={styles.footerRow}>
        <View style={styles.footerMeta}>
          {totalPrice ? (
            <Text
              weight="bold"
              style={{
                color: colors.text,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.md,
              }}
            >
              {totalPrice}
            </Text>
          ) : null}

          <View style={styles.footerMetaLine}>
            <Text
              weight="medium"
              style={{
                color: colors.iconMuted,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {`${serviceCount} ${serviceCountLabel}`}
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
            label={t('service_details_book_service')}
            onPress={onBookService}
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
