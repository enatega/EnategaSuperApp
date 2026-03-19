import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Image from '../../../../../general/components/Image';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import Icon from '../../../../../general/components/Icon';
import type { DeliveryStoreDetailsProduct } from '../../../api/types';
import {
  useStoreDetailCardSwipe,
  type StoreDetailSwipeDirection,
} from '../../hooks/useStoreDetailSwiper';

type Props = {
  item: DeliveryStoreDetailsProduct;
  onSwipeCategory?: (direction: StoreDetailSwipeDirection) => void;
};

export default function StoreDetailMenuCard({ item, onSwipeCategory }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const badgeText = item.deal ?? item.dealType ?? null;
  const priceLabel =
    typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : null;
  const productImageUri = item.imageUrl || 'https://placehold.co/400x400.png';
  const imageBackgroundColor = badgeText
    ? colors.storeMenuAccentOrange
    : colors.storeMenuAccentLime;
  const panHandlers = useStoreDetailCardSwipe({ onSwipe: onSwipeCategory });

  return (
    <View {...panHandlers} style={styles.gestureArea}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={[styles.imageArea, { backgroundColor: imageBackgroundColor }]}>
          <Image
            resizeMode="cover"
            source={{ uri: productImageUri }}
            style={styles.backgroundImage}
          />

          <View style={styles.imageHeader}>
            <View style={styles.badgeSlot}>
              {badgeText ? (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Icon color={colors.white} name="pricetag-outline" size={11} type="Ionicons" />
                  <Text style={[styles.badgeText, { color: colors.white }]} weight="medium">
                    {badgeText}
                  </Text>
                </View>
              ) : null}
            </View>

            <Pressable
              accessibilityLabel={t('store_details_add_product', { item: item.name })}
              accessibilityRole="button"
              onPress={() => undefined}
              style={[
                styles.addButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  shadowColor: colors.shadowColor,
                },
              ]}
            >
              <Icon color={colors.text} name="plus" size={18} type="Feather" />
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          {priceLabel ? (
            <Text style={[styles.price, { color: colors.primary }]} weight="medium">
              {priceLabel}
            </Text>
          ) : null}
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1} weight="semiBold">
            {item.name}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gestureArea: {
    flexShrink: 0,
    marginVertical: 6,
    width: '48%',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  imageArea: {
    aspectRatio: 1.15,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  imageHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeSlot: {
    flex: 1,
    paddingRight: 8,
  },
  badge: {
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 18,
  },
  addButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    width: 32,
  },
  content: {
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  price: {
    fontSize: 12,
    lineHeight: 18,
  },
  title: {
    fontSize: 14,
    lineHeight: 22,
  },
});
