import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../../../general/components/Text';
import Image from '../../../general/components/Image';
import { useTheme } from '../../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import { usePublicShopTypes } from '../../deliveries/hooks';
import type { ImageSourcePropType } from 'react-native';

type DeliveryService = {
  id: string;
  title: string;
  imageUrl?: string | null;
  imageSource?: ImageSourcePropType;
  cardWidth: number;
};

type Props = {
  onSelectService?: (shopTypeId: string) => void;
};

export default function DeliveryServicesSection({ onSelectService }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');
  const { data: shopTypes = [] } = usePublicShopTypes();

  const foodDeliveryCard: DeliveryService = {
    id: 'food-delivery',
    title: t('delivery_service_food_title'),
    imageSource: require('../assets/images/pizza.png'),
    cardWidth: 152,
  };

  const dynamicItems: DeliveryService[] = shopTypes.slice(0, 8).map((shopType) => ({
    id: shopType.id,
    title: shopType.name,
    imageUrl: shopType.image ?? null,
    cardWidth: 152,
  }));
  const items: DeliveryService[] = [
    foodDeliveryCard,
    ...dynamicItems.filter((item) => item.title.toLowerCase() !== foodDeliveryCard.title.toLowerCase()),
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
            {item.imageSource ? (
              <Image source={item.imageSource} style={styles.image} />
            ) : item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            ) : (
              <View style={[styles.imageFallback, { backgroundColor: colors.border }]} />
            )}
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
  imageFallback: {
    width: 48,
    height: 48,
  },
});
