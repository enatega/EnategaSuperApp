import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import HorizontalList from '../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../general/components/SectionActionHeader';
import Text from '../../../../general/components/Text';
import type { SearchStoreItem } from '../../api/searchServiceTypes';
import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from '../../api/types';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../discovery';
import StoreCard from '../storeCard/StoreCard';

type DealsItem = DeliveryNearbyStore | SearchStoreItem | DeliveryShopTypeProduct;

type Props = {
  title: string;
  items: DealsItem[];
  isPending: boolean;
  isError: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
  onItemPress?: (item: DealsItem) => void;
};

function isProductItem(item: DealsItem): item is DeliveryShopTypeProduct {
  return 'productId' in item && 'productName' in item;
}

function getItemKey(item: DealsItem, index: number) {
  if (isProductItem(item)) {
    return `${item.productId}-${item.storeId}`;
  }

  return `${item.storeId}-${item.deal ?? item.dealAmount ?? index}`;
}

export default function Deals({
  title,
  items,
  isPending,
  isError,
  actionLabel,
  onActionPress,
  onItemPress,
}: Props) {
  const { typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const isEmpty = !isPending && !isError && items.length === 0;
  const renderItem = useCallback(
    ({ item }: { item: DealsItem }) => (
      <StoreCard
        store={item}
        onPress={onItemPress ? () => onItemPress(item) : undefined}
      />
    ),
    [onItemPress],
  );

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

      {isPending ? (
        <DiscoveryResultsSkeleton />
      ) : isError ? (
        <DiscoverySectionState
          tone="error"
          title={t('multi_vendor_home_section_error_title')}
          message={t('multi_vendor_home_section_error_message')}
        />
      ) : isEmpty ? (
        <DiscoverySectionState
          title={t('multi_vendor_home_section_empty_title')}
          message={t('multi_vendor_home_section_empty_message')}
        />
      ) : (
        <HorizontalList
          data={items}
          keyExtractor={getItemKey}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingRight: 16,
  },
  separator: {
    width: 12,
  },
});
