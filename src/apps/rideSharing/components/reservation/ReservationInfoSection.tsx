import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  waitTime?: string;
  cancellationPolicy?: string;
};

export default function ReservationInfoSection({ waitTime, cancellationPolicy }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text weight="semiBold" variant="subtitle" style={styles.title}>
        {t('reservation_things_to_mind')}
      </Text>

      {waitTime && (
        <View style={styles.infoRow}>
          <Ionicons name="hourglass-outline" size={28} color={colors.mutedText} />
          <View style={styles.infoContent}>
            <Text weight="semiBold" style={styles.infoTitle}>
              {t('reservation_wait_time')}
            </Text>
            <Text variant="caption" color={colors.mutedText}>
              {waitTime}
            </Text>
          </View>
        </View>
      )}

      {cancellationPolicy && (
        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark-outline" size={28} color={colors.mutedText} />
          <View style={styles.infoContent}>
            <Text weight="semiBold" style={styles.infoTitle}>
              {t('reservation_cancellation_policy')}
            </Text>
            <Text variant="caption" color={colors.mutedText}>
              {cancellationPolicy}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
  },
  title: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    marginBottom: 4,
  },
});
