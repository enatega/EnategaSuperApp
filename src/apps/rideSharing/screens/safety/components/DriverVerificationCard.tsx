import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../../general/components/Icon';
import Image from '../../../../../general/components/Image';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type VerificationRowProps = {
  iconName: string;
  label: string;
};

function VerificationRow({ iconName, label }: VerificationRowProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.verificationRow, { borderTopColor: colors.border }]}>
      <Icon type="Feather" name={iconName} size={22} color={colors.text} />
      <Text style={[styles.verificationLabel, { color: colors.text }]}>{label}</Text>
      <Icon type="Feather" name="check-circle" size={20} color={colors.success} />
    </View>
  );
}

type Props = {
  driverName?: string;
  driverAvatarUri?: string;
  driverRating?: number;
  vehicleLabel?: string;
  onDriverPress?: () => void;
};

function DriverVerificationCard({
  driverName,
  driverAvatarUri,
  driverRating,
  vehicleLabel,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text weight="bold" style={[styles.sectionTitle, { color: colors.text }]}>
        {t('safety_driver_verifications')}
      </Text>

      <View style={styles.driverRow}>
        {driverAvatarUri ? (
          <Image source={{ uri: driverAvatarUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: colors.cardSoft }]}>
            <Text weight="bold" style={[styles.avatarInitial, { color: colors.text }]}>
              {(driverName ?? 'D').slice(0, 1).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.driverInfo}>
          <Text weight="semiBold" style={[styles.driverName, { color: colors.text }]}>
            {driverName ?? t('ride_active_driver_fallback')}
          </Text>
          {typeof driverRating === 'number' ? (
            <View style={styles.ratingRow}>
              <Icon type="FontAwesome" name="star" size={12} color={colors.yellow500} />
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {driverRating.toFixed(2)}
              </Text>
            </View>
          ) : null}
          {vehicleLabel ? (
            <Text style={[styles.vehicleText, { color: colors.mutedText }]}>
              {vehicleLabel}
            </Text>
          ) : null}
        </View>
      </View>

      <VerificationRow iconName="credit-card" label={t('safety_verification_license')} />
      <VerificationRow iconName="camera" label={t('safety_verification_photo')} />
      <VerificationRow iconName="user" label={t('safety_verification_selfie')} />
    </View>
  );
}

export default memo(DriverVerificationCard);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 22,
    marginBottom: 12,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 24,
  },
  driverInfo: {
    flex: 1,
    gap: 4,
  },
  driverName: {
    fontSize: 15,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    lineHeight: 18,
  },
  vehicleText: {
    fontSize: 12,
    lineHeight: 18,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  verificationLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
});
