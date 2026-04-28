import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { DriverProfileData } from './types';
import { formatMonthYear } from './helpers';

type Props = {
  data: DriverProfileData;
};

export default function DriverInformationSection({ data }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');
  const vehicleLabel = [data.vehicle.vehicleName, data.vehicle.vehicleNo].filter(Boolean).join(' — ') || '—';

  return (
    <View style={styles.container}>
      <Text
        weight="extraBold"
        style={{
          color: colors.text,
          fontSize: typography.size.h5,
          lineHeight: typography.lineHeight.h5,
        }}
      >
        {t('driver_profile_info_title')}
      </Text>

      <View style={styles.cardsColumn}>
        <View style={[styles.infoCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <View style={[styles.iconWrap, { backgroundColor: colors.gray100 }]}>
            <Text style={styles.iconText}>🚲</Text>
          </View>
          <View style={styles.cardTextCol}>
            <Text style={[styles.caption, { color: colors.mutedText }]}>{t('driver_profile_info_vehicle')}</Text>
            <Text style={[styles.value, { color: colors.text }]} weight="medium">
              {vehicleLabel}
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <View style={[styles.iconWrap, { backgroundColor: colors.gray100 }]}>
            <Text style={styles.iconText}>🗓️</Text>
          </View>
          <View style={styles.cardTextCol}>
            <Text style={[styles.caption, { color: colors.mutedText }]}>{t('driver_profile_info_member_since')}</Text>
            <Text style={[styles.value, { color: colors.text }]} weight="medium">{formatMonthYear(data.joiningTime)}</Text>
          </View>
        </View>

        <View style={[styles.infoCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <View style={[styles.iconWrap, { backgroundColor: colors.gray100 }]}>
            <Text style={styles.iconText}>🌐</Text>
          </View>
          <View style={styles.cardTextCol}>
            <Text style={[styles.caption, { color: colors.mutedText }]}>{t('driver_profile_info_languages')}</Text>
            <Text style={[styles.value, { color: colors.text }]} weight="medium">{t('driver_profile_info_languages_value')}</Text>
          </View>
        </View>

        <View style={[styles.infoCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <View style={[styles.iconWrap, { backgroundColor: colors.gray100 }]}>
            <Text style={styles.iconText}>✅</Text>
          </View>
          <View style={styles.cardTextCol}>
            <Text style={[styles.caption, { color: colors.mutedText }]}>{t('driver_profile_info_background_check')}</Text>
            <Text style={[styles.value, { color: colors.text }]} weight="medium">{t('driver_profile_info_verified_passed')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  caption: {
    fontSize: 10,
    lineHeight: 14,
  },
  cardTextCol: {
    flex: 1,
  },
  cardsColumn: {
    gap: 12,
  },
  container: {
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  iconText: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  infoCard: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  value: {
    fontSize: 14,
    lineHeight: 22,
  },
});
