import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../general/components/Text';
import Image from '../../../general/components/Image';
import { useTheme } from '../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

type DeliveryService = {
  id: string;
  title: string;
  image: string;
};

const foodImage = 'https://www.figma.com/api/mcp/asset/79f928f9-686e-4a66-aca3-242383ee46d8';
const groceryImage = 'https://www.figma.com/api/mcp/asset/9332698f-1fbb-4679-b9c4-cd7df1a1c9bd';
const giftImage = 'https://www.figma.com/api/mcp/asset/8d726e5c-0ee9-446e-9ad5-086e6fab61e2';
const medicineImage = 'https://www.figma.com/api/mcp/asset/007e3097-6001-4efb-b8cc-5db9f1ebd541';

export default function DeliveryServicesSection() {
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
          <View key={item.id} style={[styles.card, { backgroundColor: colors.blue50 }]}>
            <Text
              weight="semiBold"
              style={{ fontSize: typography.size.xs2, lineHeight: typography.lineHeight.xs2,maxWidth:80 }}
            >
              {item.title}
            </Text>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>
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
    width: 174.5,
    height: 81,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  image: {
    width: 48,
    height: 48,
  },
});
