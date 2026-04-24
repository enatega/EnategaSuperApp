import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { HomeVisitsSingleVendorBookingItem } from '../../api/types';

type Props = {
  booking: HomeVisitsSingleVendorBookingItem;
  onPress: () => void;
};

export default function ActiveServiceCard({ booking, onPress }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');

  const title = booking.title || t('single_vendor_active_service_default_title');
  const subtitle = booking.durationLabel || booking.statusLabel || t('single_vendor_active_service_default_subtitle');

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { backgroundColor: '#F59E0B' }]}
    >
      <View style={styles.content}>
        <View style={styles.textBlock}>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.lg,
              lineHeight: typography.lineHeight.lg,
            }}
            weight="bold"
          >
            {t('single_vendor_active_service_title')}
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
            numberOfLines={1}
            weight="semiBold"
          >
            {title}
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
            numberOfLines={1}
            weight="medium"
          >
            {subtitle}
          </Text>
        </View>

        <View style={styles.iconWrap}>
          <MaterialCommunityIcons color={colors.text} name="dots-horizontal" size={24} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: -4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textBlock: {
    flex: 1,
    gap: 2,
    marginRight: 12,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
});
