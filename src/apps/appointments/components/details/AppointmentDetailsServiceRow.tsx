import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { AppointmentStoreService } from '../../api/types';
import AppointmentServicePrice from '../services/AppointmentServicePrice';
import { getServiceMeta } from './detailHelpers';

type Props = {
  item: AppointmentStoreService;
  onPress?: (service: AppointmentStoreService) => void;
};

export default function AppointmentDetailsServiceRow({ item, onPress }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('appointments');
  const metaLabel = getServiceMeta(item, t('details_service_meta_fallback'));

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.md,
            lineHeight: typography.lineHeight.md,
          }}
          weight="semiBold"
        >
          {item.name}
        </Text>

        <View style={styles.metaRow}>
          <AppointmentServicePrice
            dealName={item.deal?.name}
            originalPrice={item.originalPrice}
            price={item.price}
          />
          <Text style={{ color: colors.mutedText, fontSize: typography.size.sm }}>
            {metaLabel}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => onPress?.(item)}
        style={[
          styles.bookButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={{ color: colors.text, fontSize: typography.size.md }} weight="semiBold">
          {t('details_book_now_short')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bookButton: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 74,
    paddingHorizontal: 14,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
