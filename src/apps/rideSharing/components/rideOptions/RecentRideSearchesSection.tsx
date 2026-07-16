import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import CachedAddressRow from './CachedAddressRow';
import type { CachedAddress } from './types';

type Props = {
  addresses: CachedAddress[];
  onPress: (address: CachedAddress) => void;
};

const MAX_VISIBLE_ADDRESSES = 4;

function RecentRideSearchesSection({ addresses, onPress }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation(['general', 'rideSharing']);
  const visibleAddresses = useMemo(
    () => addresses.slice(0, MAX_VISIBLE_ADDRESSES),
    [addresses],
  );

  return (
    <View style={styles.section}>
      <Text
        weight="extraBold"
        style={[
          styles.title,
          {
            color: colors.text,
            fontSize: typography.size.lg,
            lineHeight: typography.lineHeight.h5,
            marginTop: 10,
          },
        ]}
      >
        {t('recent_searches', { ns: 'general' })}
      </Text>

      {visibleAddresses.length > 0 ? (
        <View style={styles.list}>
          {visibleAddresses.map((address) => (
            <CachedAddressRow
              key={address.placeId}
              item={address}
              onPress={onPress}
              containerStyle={styles.row}
            />
          ))}
        </View>
      ) : (
        <View
          style={[
            styles.emptyState,
            {
              backgroundColor: colors.surfaceSoft,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            weight="semiBold"
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.sm2,
            }}
          >
            {t('ride_address_recent_empty_title', { ns: 'rideSharing' })}
          </Text>
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.xxs,
              lineHeight: typography.lineHeight.sm2,
            }}
          >
            {t('ride_address_recent_empty_description', { ns: 'rideSharing' })}
          </Text>
        </View>
      )}
    </View>
  );
}

export default memo(RecentRideSearchesSection);

const styles = StyleSheet.create({
  section: {
    gap: 10,
    marginTop: 6,
  },
  title: {
    paddingHorizontal: 16,
  },
  list: {
    gap: 2,
    paddingHorizontal: 8,
  },
  row: {
    marginHorizontal: 0,
  },
  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
});
