import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../general/components/Text';
import Card from '../../general/components/Card';
import Image from '../../general/components/Image';
import { useTheme } from '../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import { MiniAppId } from '../../general/utils/constants';
import { serviceIcons } from '../../general/assets/images';

type ServiceItem = {
  id: MiniAppId;
  title: string;
  background: string;
  icon: number;
};

type Props = {
  onSelectMiniApp?: (id: MiniAppId) => void;
};

export default function OurServicesSection({ onSelectMiniApp }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('general');

  const items: ServiceItem[] = [
    { id: 'deliveries', title: t('service_deliveries'), icon: serviceIcons.deliveries, background: colors.cardSoft },
    { id: 'homeVisits', title: t('service_home_visit'), icon: serviceIcons.homeVisits, background: colors.cardMint },
    { id: 'appointments', title: t('service_general_appointment'), icon: serviceIcons.appointments, background: colors.cardLavender },
    { id: 'rideSharing', title: t('service_ride_sharing'), icon: serviceIcons.rideSharing, background: colors.cardPeach },
    { id: 'developerMode', title: t('developer_mode'), icon: serviceIcons.homeVisits, background: colors.cardPeach },

  ];

  return (
    <View style={styles.section}>
      <Text variant="subtitle" weight="bold" style={styles.sectionTitle}>
        {t('services_title')}
      </Text>
      <View style={styles.grid}>
        {items.map((service) => (
          <Pressable
            key={service.id}
            onPress={() => onSelectMiniApp?.(service.id)}
            style={styles.cell}
          >
            <Card style={[styles.card, { backgroundColor: service.background }]}>
              <Text
                weight="semiBold"
                numberOfLines={2}
                style={[styles.title, { fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm }]}
              >
                {service.title}
              </Text>
              <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
                <Image source={service.icon} style={styles.icon} />
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionTitle: {
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cell: {
    width: '48%',
  },
  card: {
    minHeight: 80,
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  title: {
    maxWidth: 90,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
});
