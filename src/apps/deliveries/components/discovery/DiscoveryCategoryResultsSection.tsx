import React from 'react';
import { StyleSheet, View } from 'react-native';
import HorizontalList from '../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../general/components/SectionActionHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ProductCard from '../productCard/ProductCard';
import StoreCard from '../storeCard/StoreCard';
import DiscoveryResultsSkeleton from './DiscoveryResultsSkeleton';
import DiscoverySectionState from './DiscoverySectionState';
import type {
  DiscoveryCategoryResultCardType,
  DiscoveryCategoryResultItem,
} from './types';
import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from '../../api/types';

type Props = {
  title: string;
  cardType: DiscoveryCategoryResultCardType;
  items: DiscoveryCategoryResultItem[];
  isLoading: boolean;
  hasError: boolean;
  emptyMessage: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

function getItemKey(
  item: DiscoveryCategoryResultItem,
  cardType: DiscoveryCategoryResultCardType,
) {
  if (cardType === 'product') {
    const product = item as DeliveryShopTypeProduct;
    return `${product.productId}-${product.storeId}`;
  }

  return (item as DeliveryNearbyStore).storeId;
}

function renderCard(
  item: DiscoveryCategoryResultItem,
  cardType: DiscoveryCategoryResultCardType,
) {
  if (cardType === 'product') {
    return (
      <ProductCard
        product={item as DeliveryShopTypeProduct}
        variant="rail"
      />
    );
  }

  return <StoreCard store={item as DeliveryNearbyStore} />;
}

export default function DiscoveryCategoryResultsSection({
  title,
  cardType,
  items,
  isLoading,
  hasError,
  emptyMessage,
  actionLabel,
  onActionPress,
}: Props) {
  const { typography } = useTheme();
  const isEmpty = !isLoading && !hasError && items.length === 0;

  return (
    <View style={styles.section}>
      {actionLabel ? (
        <SectionActionHeader
          actionLabel={actionLabel}
          onActionPress={onActionPress}
          title={title}
        />
      ) : (
        <Text
          weight="extraBold"
          style={{
            fontSize: typography.size.h5,
            letterSpacing: -0.36,
            lineHeight: typography.lineHeight.h5,
          }}
        >
          {title}
        </Text>
      )}

      {isLoading ? (
        <DiscoveryResultsSkeleton />
      ) : hasError ? (
        <DiscoverySectionState tone="error" />
      ) : isEmpty ? (
        <DiscoverySectionState message={emptyMessage} />
      ) : (
        <HorizontalList
          data={items}
          keyExtractor={(item) => getItemKey(item, cardType)}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => renderCard(item, cardType)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingRight: 16,
  },
  section: {
    gap: 12,
  },
  separator: {
    width: 12,
  },
});
