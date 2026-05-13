import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RideIntent } from '../utils/rideOptions';
import type { SharedStackParamList } from '../../../general/navigation/navigationTypes';
import CarIcon from '../assets/images/carIcon.png';
import CalendarIcon from '../assets/images/calendarIcon.png';
import ClockIcon from '../assets/images/hourlyIcon.png';
import TruckIcon from '../assets/images/courierIcon.png';
import ServiceRideImage from '../assets/images/rideIcon.png';
import ServiceDeliveriesImage from '../assets/images/deliveriesIcon.png';
import ServiceCourierImage from '../assets/images/courierHomeIcon.png';

type RideOption = {
  id: RideIntent;
  title: string;
  icon: ImageSourcePropType;
};

type Props = {
  onSelectRideOption?: (rideIntent: RideIntent) => void;
};

type ServiceCardId = 'ride' | 'deliveries' | 'courier';

const ICON_SIZE = 48;
const SERVICE_CARD_ICON_SIZE = 80;

export default function RideOptionsSection({ onSelectRideOption }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation<NativeStackNavigationProp<SharedStackParamList>>();

  const items: RideOption[] = [
    {
      id: 'now',
      title: t('ride_option_now_title'),
      icon: CarIcon,
    },
    {
      id: 'schedule',
      title: t('ride_option_schedule_title'),
      icon: CalendarIcon,
    },
    {
      id: 'rental',
      title: t('ride_option_rental_title'),
      icon: ClockIcon,
    },
    {
      id: 'courier',
      title: t('ride_option_courier_title'),
      icon: TruckIcon,
    },
  ];

  function handleSelectOption(rideIntent: RideIntent) {
    if (onSelectRideOption) {
      onSelectRideOption(rideIntent);
      return;
    }

    navigation.navigate('RideSharing', {
      screen: 'RideSharingHome',
      params: {
        rideType: rideIntent,
        directCourierOnly: rideIntent === 'courier',
      },
    });
  }

  function handleSelectServiceCard(cardId: ServiceCardId) {
    if (cardId === 'ride') {
      handleSelectOption('now');
      return;
    }

    if (cardId === 'courier') {
      handleSelectOption('courier');
      return;
    }

    navigation.navigate('Deliveries');
  }

  return (
    <View style={styles.section}>
      <View style={styles.serviceCardsRow}>
        <Pressable style={[styles.serviceCard, { backgroundColor: colors.blue50 }]} onPress={() => handleSelectServiceCard('ride')}>
          <Image source={ServiceRideImage} style={styles.serviceCardIcon} resizeMode="contain" />
          <Text weight="extraBold" style={[styles.serviceCardTitle, { color: colors.text }]}>
            {t('ride_home_service_ride_title')}
          </Text>
          <Text style={[styles.serviceCardSubtitle, { color: colors.mutedText }]}>
            {t('ride_home_service_ride_subtitle')}
          </Text>
        </Pressable>

        <Pressable style={[styles.serviceCard, { backgroundColor: colors.blue50 }]} onPress={() => handleSelectServiceCard('deliveries')}>
          <Image source={ServiceDeliveriesImage} style={styles.serviceCardIcon} resizeMode="contain" />
          <Text weight="extraBold" style={[styles.serviceCardTitle, { color: colors.text }]}>
            {t('ride_home_service_deliveries_title')}
          </Text>
          <Text style={[styles.serviceCardSubtitle, { color: colors.mutedText }]}>
            {t('ride_home_service_deliveries_subtitle')}
          </Text>
        </Pressable>

        <Pressable style={[styles.serviceCard, { backgroundColor: colors.blue50 }]} onPress={() => handleSelectServiceCard('courier')}>
          <Image source={ServiceCourierImage} style={styles.serviceCardIcon} resizeMode="contain" />
          <Text weight="extraBold" style={[styles.serviceCardTitle, { color: colors.text }]}>
            {t('ride_home_service_courier_title')}
          </Text>
          <Text style={[styles.serviceCardSubtitle, { color: colors.mutedText }]}>
            {t('ride_home_service_courier_subtitle')}
          </Text>
        </Pressable>
      </View>

      <Text
        weight="extraBold"
        style={[
          styles.sectionTitle,
          { fontSize: typography.size.lg, lineHeight: typography.lineHeight.md, color: colors.text },
        ]}
      >
        {t('ride_options_title')}
      </Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <Pressable key={item.id} style={styles.item} onPress={() => handleSelectOption(item.id)}>
            <View style={[styles.iconWrap, { backgroundColor: colors.blue50 }]}>
              <Image source={item.icon} style={styles.icon} resizeMode="contain" />
            </View>
            <Text
              weight="semiBold"
              style={{
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.xs2,
                textAlign: 'center',
              }}
            >
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 16,
  },
  serviceCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  serviceCard: {
    alignItems: 'center',
    borderRadius: 16,
    flex: 1,
    minHeight: 168,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  serviceCardIcon: {
    height: SERVICE_CARD_ICON_SIZE,
    marginBottom: 8,
    width: SERVICE_CARD_ICON_SIZE,
  },
  serviceCardTitle: {
    fontSize: 16,
    lineHeight: 16,
    marginBottom: 6,
    textAlign: 'center',
  },
  serviceCardSubtitle: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },
  sectionTitle: {
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  item: {
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});
