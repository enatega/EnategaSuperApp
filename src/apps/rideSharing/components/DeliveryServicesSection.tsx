import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import Text from '../../../general/components/Text';
import Image from '../../../general/components/Image';
import { useTheme } from '../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

type DeliveryService = {
  id: string;
  title: string;
  image: ImageSourcePropType;
  cardWidth: number;
};

type Props = {
  onSelectService?: (serviceId: string) => void;
};

const foodImage = require('../../rideSharing/assets/images/pizza.png');
const groceryImage = require('../../rideSharing/assets/images/basket.png');
const giftImage = require('../../rideSharing/assets/images/gift.png');
const medicineImage = require('../../rideSharing/assets/images/medicine.png');

export default function DeliveryServicesSection({ onSelectService }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');

  const items: DeliveryService[] = [
    {
      id: 'food',
      title: t('delivery_service_food_title'),
      image: foodImage,
      cardWidth: 152,
    },
    {
      id: 'grocery',
      title: t('delivery_service_grocery_title'),
      image: groceryImage,
      cardWidth: 152,
    },
    {
      id: 'gift',
      title: t('delivery_service_gift_title'),
      image: giftImage,
      cardWidth: 152,
    },
    {
      id: 'medicine',
      title: t('delivery_service_medicine_title'),
      image: medicineImage,
      cardWidth: 160,
    },
  ];

  return (
    <View style={styles.section}>
      <Text
        weight="extraBold"
        style={[
          styles.sectionTitle,
          {
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
            color: colors.text,
          },
        ]}
      >
        {t('delivery_services_title')}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowContent}
      >
        {items.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.card,
              {
                width: item.cardWidth,
                backgroundColor: colors.blue50,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={() => onSelectService?.(item.id)}
          >
            <Text
              weight="semiBold"
              style={[
                styles.cardTitle,
                {
                  fontSize: typography.size.xs2,
                  lineHeight: typography.lineHeight.xs2,
                  color: colors.text,
                },
              ]}
            >
              {item.title}
            </Text>
            <Image source={item.image} style={styles.image} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 16,
  },
  sectionTitle: {
    letterSpacing: -0.36,
  },
  rowContent: {
    gap: 12,
    paddingRight: 12,
  },
  card: {
    height: 81,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  cardTitle: {
    maxWidth: 74,
  },
  image: {
    width: 48,
    height: 48,
  },
});
