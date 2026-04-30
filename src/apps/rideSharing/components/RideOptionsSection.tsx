import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import Text from '../../../general/components/Text';
import Image from '../../../general/components/Image';
import { useTheme } from '../../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { RideIntent } from '../utils/rideOptions';

type RideOption = {
  id: RideIntent;
  title: string;
  icon: ImageSourcePropType;
};

type Props = {
  onSelectRideOption?: (rideIntent: RideIntent) => void;
};

const rideIcon = require('../../rideSharing/assets/images/3d-car.png');
const scheduledIcon = require('../../rideSharing/assets/images/calendar.png');
const hourlyIcon = require('../../rideSharing/assets/images/3d-alarm.png');
const courierIcon = require('../../rideSharing/assets/images/3d-truck.png');

export default function RideOptionsSection({ onSelectRideOption }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation();

  const items: RideOption[] = [
    {
      id: 'now',
      title: t('ride_option_now_title'),
      icon: rideIcon,
    },
    {
      id: 'schedule',
      title: t('ride_option_schedule_title'),
      icon: scheduledIcon,
    },
    {
      id: 'rental',
      title: t('ride_option_rental_title'),
      icon: hourlyIcon,
    },
    {
      id: 'courier',
      title: t('ride_option_courier_title'),
      icon: courierIcon,
    },
  ];

  function handleSelectOption(rideIntent: RideIntent) {
    if (onSelectRideOption) {
      onSelectRideOption(rideIntent);
      return;
    }

    (navigation as any).navigate('RideSharingHome');
  }

  return (
    <View style={styles.section}>
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
          <Pressable
            key={item.id}
            style={styles.item}
            onPress={() => handleSelectOption(item.id)}
          >
            <View style={[styles.iconWrap, { backgroundColor: colors.blue50 }]}>
              <Image source={item.icon} style={styles.icon} />
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
    width: 48,
    height: 48,
  },
});
