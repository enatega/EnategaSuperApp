import React from 'react';
import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
  DeliveryTopBrand,
} from '../../../api/types';
import ProductCard from '../../../components/productCard/ProductCard';
import type { ProductCardVariant } from '../../../components/productCard/types';
import StoreCard from '../../../components/storeCard/StoreCard';
import TopBrandCard from '../../../components/storeCard/TopBrandCard';
import { DiscoveryCategoryCard } from '../../../components/discovery';
import type { SupportedCardType } from '../../../../../general/components/filterablePaginatedList';
import type { SeeAllMapStoreSource } from '../../../../../general/screens/SeeAllScreen/components/mapStoreUtils';
import type { SeeAllItem } from '../../../navigation/sharedTypes';

type ShopTypeListItem = {
  image?: string | null;
  imageUrl?: string | null;
  name?: string;
};

function isShopTypeProductItem(item: unknown): item is DeliveryShopTypeProduct {
  return (
    typeof item === 'object' &&
    item !== null &&
    'productId' in item &&
    'productName' in item
  );
}

export function renderSeeAllItemCard(
  cardType: SupportedCardType,
  item: SeeAllItem,
  onPress?: () => void,
  cardVariant?: ProductCardVariant,
  isRailProductCardFullWidth?: boolean,
) {
  if (cardType === 'store') {
    if (isShopTypeProductItem(item)) {
      return <ProductCard product={item} variant="rail" onPress={onPress} />;
    }

    return <StoreCard layout="fullWidth" store={item as DeliveryNearbyStore} />;
  }

  if (cardType === 'top-brand') {
    return <TopBrandCard brand={item as DeliveryTopBrand} />;
  }

  if (cardType === 'shop-type') {
    const shopTypeItem = item as ShopTypeListItem;

    return (
      <DiscoveryCategoryCard
        imageUrl={shopTypeItem.imageUrl ?? shopTypeItem.image ?? null}
        title={shopTypeItem.name ?? ''}
        onPress={onPress}
      />
    );
  }

  return (
    <ProductCard
      product={item as DeliveryShopTypeProduct}
      variant={cardVariant}
      isFullWidth={isRailProductCardFullWidth}
      onPress={onPress}
    />
  );
}

function isDeliveryShopTypeProduct(item: SeeAllItem): item is DeliveryShopTypeProduct {
  return 'productId' in item;
}

export function mapStoreFromSeeAllItem(item: SeeAllItem): SeeAllMapStoreSource {
  if (isDeliveryShopTypeProduct(item)) {
    return {
      id: `${item.productId}-${item.storeId}`,
      title: item.storeName ?? item.productName,
      subtitle: item.storeAddress ?? undefined,
      imageUrl:
        item.storeImage ??
        item.storeLogo ??
        item.productImage ??
        'https://placehold.co/200x200.png',
      rating: item.averageRating ?? undefined,
      reviewCount: item.reviewCount ?? undefined,
      deliveryFee: item.baseFee ?? item.price ?? undefined,
      deliveryTime: item.deliveryTime ?? undefined,
      distanceKm: item.distanceKm ?? undefined,
      latitude: item.latitude,
      longitude: item.longitude,
    };
  }

  return {
    id: item.storeId,
    title: item.name,
    subtitle: item.address ?? undefined,
    imageUrl: item.coverImage ?? item.logo ?? 'https://placehold.co/200x200.png',
    rating: item.averageRating ?? undefined,
    reviewCount: item.reviewCount ?? undefined,
    deliveryFee: item.baseFee ?? undefined,
    deliveryTime: item.deliveryTime ?? undefined,
    distanceKm: item.distanceKm ?? undefined,
    latitude: item.latitude,
    longitude: item.longitude,
  };
}
