import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Image from '../../../../../general/components/Image';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import Icon from '../../../../../general/components/Icon';
import type { DeliveryStoreDetailsProduct } from '../../../api/types';

type Props = {
  item: DeliveryStoreDetailsProduct;
};

export default function StoreDetailMenuCard({ item }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const badgeText = item.deal ?? item.dealType ?? null;
  const priceLabel =
    typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : null;
  const imageBackgroundColor = badgeText
    ? colors.storeMenuAccentOrange
    : colors.storeMenuAccentLime;

  return (
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
            accessibilityLabel={t('store_details_add_product', { item: item.productName })}
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

        <View style={styles.imageWrapper}>
          <Image
            resizeMode="contain"
            source={{ uri: item.productImage || 'https://placehold.co/400x400.png' }}
            style={styles.image}
          />
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
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    marginVertical: 6,
  },
  imageArea: {
    aspectRatio: 1.15,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 8,
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
  imageWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  image: {
    height: '78%',
    width: '100%',
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
