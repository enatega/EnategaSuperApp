import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  insets: EdgeInsets;
  servicesCount: number;
  bookNowDisabled: boolean;
  storeClosed: boolean;
  onPress: () => void;
};

export default function AppointmentDetailsBottomBar({
  bookNowDisabled,
  insets,
  onPress,
  servicesCount,
  storeClosed,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('appointments');

  return (
    <View
      style={[
        styles.bottomBar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom + 12,
        },
      ]}
    >
      <View style={styles.meta}>
        <Text style={{ color: colors.mutedText, fontSize: typography.size.xs }}>
          {t('details_services_available', { count: servicesCount })}
        </Text>
      </View>

      <Pressable
        disabled={bookNowDisabled}
        onPress={onPress}
        style={[
          styles.primaryCta,
          {
            backgroundColor: bookNowDisabled || storeClosed ? colors.gray100 : colors.primary,
          },
        ]}
      >
        <Text
          style={{
            color: bookNowDisabled ? colors.iconDisabled : colors.white,
            fontSize: typography.size.md,
          }}
          weight="bold"
        >
          {t('details_book_now')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
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
    flex: 1,
    gap: 2,
  },
  primaryCta: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 138,
    paddingHorizontal: 26,
  },
});
