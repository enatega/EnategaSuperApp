import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../general/components/Text';
import Image from '../../../general/components/Image';
import { useTheme } from '../../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { RideIntent } from '../utils/rideOptions';

type RideOption = {
  id: RideIntent;
  title: string;
  icon: string;
};

const rideIcon = 'https://www.figma.com/api/mcp/asset/3390d01b-1526-4c81-8f48-c893f0c72934';
const scheduledIcon = 'https://www.figma.com/api/mcp/asset/bb35b336-dd7e-4ea5-a109-ed7670f4e8de';
const hourlyIcon = 'https://www.figma.com/api/mcp/asset/49504a75-984a-43cb-8eca-b0d94303cd10';
const courierIcon = 'https://www.figma.com/api/mcp/asset/513bf805-51ec-4377-acbb-775318fcfe6f';

export default function RideOptionsSection() {
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
            onPress={() => navigation.navigate('RideOptions' as never, { rideType: item.id } as never)}
          >
            <View style={[styles.iconWrap, { backgroundColor: colors.blue50 }]}>
              <Image source={{ uri: item.icon }} style={styles.icon} />
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
