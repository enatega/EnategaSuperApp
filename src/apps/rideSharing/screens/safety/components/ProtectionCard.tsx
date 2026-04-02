import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type ProtectionItemProps = {
  label: string;
};

function ProtectionItem({ label }: ProtectionItemProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.item, { backgroundColor: colors.backgroundTertiary }]}>
      <Text style={[styles.itemLabel, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

function ProtectionCard() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');

  const items = [
    t('safety_protection_proactive'),
    t('safety_protection_verification'),
    t('safety_protection_privacy'),
    t('safety_protection_safe_ride'),
    t('safety_protection_accidents'),
  ];

  return (
    <View style={styles.container}>
      <Text weight="bold" style={[styles.sectionTitle, { color: colors.text }]}>
        {t('safety_how_protected')}
      </Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <ProtectionItem key={item} label={item} />
        ))}
      </View>
    </View>
  );
}

export default memo(ProtectionCard);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  item: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    width: '48%',
  },
  itemLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
