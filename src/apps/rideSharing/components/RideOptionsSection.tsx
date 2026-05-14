import React from 'react';
import {
  FlatList,
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
import { authSession } from '../../../general/auth/authSession';
import { setActiveAppRoute, setPendingAppRoute } from '../../../general/navigation/pendingAppRedirect';
import { resetToSharedRoute } from '../../../general/navigation/rootNavigation';
import { MINI_APPS, type MiniAppId } from '../../registry/generated/appI18nRegistry';
import { APP_ROUTE_BY_ID, type SharedAppRouteName } from '../../registry/generated/appRegistry';
import CarIcon from '../assets/images/carIcon.png';
import CalendarIcon from '../assets/images/calendarIcon.png';
import ClockIcon from '../assets/images/hourlyIcon.png';
import TruckIcon from '../assets/images/courierIcon.png';
import ServiceRideImage from '../assets/images/rideIcon.png';
import ServiceDeliveriesImage from '../assets/images/deliveriesIcon.png';
import ServiceCourierImage from '../assets/images/courierHomeIcon.png';
import ServiceHomeVisitsImage from '../../../general/assets/images/3d-house.png';

type RideOption = {
  id: RideIntent;
  title: string;
  icon: ImageSourcePropType;
};

type Props = {
  onSelectRideOption?: (rideIntent: RideIntent) => void;
};

type ServiceCardId = 'ride' | 'deliveries' | 'courier' | 'homeVisits';
type ServiceCard = {
  id: ServiceCardId;
  title: string;
  subtitle: string;
  icon: ImageSourcePropType;
};

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

  async function handleSelectMiniApp(
    routeName: SharedAppRouteName,
    params?: SharedStackParamList[SharedAppRouteName],
  ) {
    const token = await authSession.getAccessToken();

    if (token) {
      await setActiveAppRoute(routeName);
      resetToSharedRoute(routeName, params);
      return;
    }

    await setPendingAppRoute(routeName);
    navigation.navigate('Auth');
  }

  function handleSelectOption(rideIntent: RideIntent) {
    if (onSelectRideOption) {
      onSelectRideOption(rideIntent);
      return;
    }

    void handleSelectMiniApp('RideSharing', {
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

    if (cardId === 'homeVisits') {
      const routeName = APP_ROUTE_BY_ID.homeVisits;
      if (routeName) {
        void handleSelectMiniApp(routeName);
      }
      return;
    }

    void handleSelectMiniApp('Deliveries');
  }

  const enabledApps = new Set<MiniAppId>(MINI_APPS);
  const allServiceCards: ServiceCard[] = [
    {
      id: 'ride',
      title: t('ride_home_service_ride_title'),
      subtitle: t('ride_home_service_ride_subtitle'),
      icon: ServiceRideImage,
    },
    {
      id: 'deliveries',
      title: t('ride_home_service_deliveries_title'),
      subtitle: t('ride_home_service_deliveries_subtitle'),
      icon: ServiceDeliveriesImage,
    },
    {
      id: 'courier',
      title: t('ride_home_service_courier_title'),
      subtitle: t('ride_home_service_courier_subtitle'),
      icon: ServiceCourierImage,
    }
   
  ];

  const serviceCards = allServiceCards.filter((card) => {
    if (card.id === 'ride' || card.id === 'courier') {
      return enabledApps.has('rideSharing');
    }

    if (card.id === 'deliveries') {
      return enabledApps.has('deliveries');
    }

    if (card.id === 'homeVisits') {
      return enabledApps.has('homeVisits');
    }

    return true;
  });

  return (
    <View style={styles.section}>
      <FlatList
        data={serviceCards}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.serviceCardsRow}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.serviceCard, { backgroundColor: colors.blue50 }]}
            onPress={() => handleSelectServiceCard(item.id)}
          >
            <Image source={item.icon} style={styles.serviceCardIcon} resizeMode="contain" />
            <Text weight="extraBold" style={[styles.serviceCardTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.serviceCardSubtitle, { color: colors.mutedText }]}>
              {item.subtitle}
            </Text>
          </Pressable>
        )}
      />

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
    gap: 12,
    paddingRight: 4,
  },
  serviceCard: {
    alignItems: 'center',
    borderRadius: 16,
    width: 132,
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
