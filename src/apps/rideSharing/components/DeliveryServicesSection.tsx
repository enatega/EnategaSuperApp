import React from 'react';
import { Pressable, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import Text from '../../../general/components/Text';
import Image from '../../../general/components/Image';
import { useTheme } from '../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

type DeliveryService = {
  id: string;
  title: string;
  image: ImageSourcePropType;
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
    },
    {
      id: 'grocery',
      title: t('delivery_service_grocery_title'),
      image: groceryImage,
    },
    {
      id: 'gift',
      title: t('delivery_service_gift_title'),
      image: giftImage,
    },
    {
      id: 'medicine',
      title: t('delivery_service_medicine_title'),
      image: medicineImage,
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
        {t('delivery_services_title')}
      </Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.blue50, opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => onSelectService?.(item.id)}
          >
            <Text
              weight="semiBold"
              style={{ fontSize: typography.size.xs2, lineHeight: typography.lineHeight.xs2, maxWidth: 80 }}
            >
              {item.title}
            </Text>
            <Image source={item.image} style={styles.image} />
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
    flexWrap: 'wrap',
    gap: 12,
   
  },
  card: {
    width: '48%',
    height: 81,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  image: {
    width: 48,
    height: 48,
  },
});
