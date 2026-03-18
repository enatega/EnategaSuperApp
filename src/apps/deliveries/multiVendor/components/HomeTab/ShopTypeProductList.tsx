import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { DeliveryShopTypeProduct } from '../../../api/types';
import StoreCard from '../../../components/store-card/StoreCard';
import ShopTypeCardSkeleton from './HomeTabSkeletons/ShopTypeCardSkeleton';

type Props = {
  errorMessage?: string;
  isLoading: boolean;
  products: DeliveryShopTypeProduct[];
  title: string;
};

export default function ShopTypeProductList({
  errorMessage,
  isLoading,
  products,
  title,
}: Props) {
  const { t } = useTranslation('deliveries');
  const { colors, typography } = useTheme();
  const hasError = Boolean(errorMessage);
  const isEmpty = !isLoading && !hasError && products.length === 0;

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t('multi_vendor_see_all')}
        onActionPress={() => {}}
        title={title}
      />

      {isLoading ? (
        <ShopTypeCardSkeleton />
      ) : hasError ? (
        <View style={[styles.messageContainer, { backgroundColor: colors.blue50 }]}>
          <Text
            weight="medium"
            style={[
              styles.messageText,
              {
                color: colors.danger,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.sm2,
              },
            ]}
          >
            {errorMessage ?? t('multi_vendor_shop_type_products_error')}
          </Text>
        </View>
      ) : isEmpty ? (
        <View style={[styles.messageContainer, { backgroundColor: colors.blue50 }]}>
          <Text
            weight="medium"
            style={[
              styles.messageText,
              {
                color: colors.mutedText,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.sm2,
              },
            ]}
          >
            {t('multi_vendor_shop_type_products_empty')}
          </Text>
        </View>
      ) : (
        <HorizontalList
          data={products}
          keyExtractor={(item) => item.productId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <StoreCard
              imageUrl={
                item.productImage ??
                item.storeImage ??
                item.storeLogo ??
                'https://placehold.co/400x400.png'
              }
              offer={item.deal ?? undefined}
              name={item.productName}
              cuisine={item.storeName ?? undefined}
              price={item.price ?? 0}
              deliveryTime=""
              distance={0}
              onPress={() => {}}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  messageContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  messageText: {
    textAlign: 'center',
  },
  listContent: {
    paddingRight: 4,
  },
  separator: {
    width: 14,
  },
});
