import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type {
  DeliveryNearbyStore,
  DeliveryTopBrand,
} from '../../api/types';
import { useNearbyStores } from '../../hooks';
import type { MultiVendorStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<MultiVendorStackParamList>;

function normalizeValue(value?: string | null) {
  return value?.trim().toLowerCase() ?? '';
}

function isBrandStoreNameMatch(
  brandName: string,
  storeName: string,
) {
  return (
    storeName === brandName ||
    storeName.includes(brandName) ||
    brandName.includes(storeName)
  );
}

export default function useTopBrandNavigation() {
  const navigation = useNavigation<NavigationProp>();
  const { data: nearbyStores = [] } = useNearbyStores();

  const resolveStoreFromBrand = useCallback(
    (brand: DeliveryTopBrand): DeliveryNearbyStore | undefined => {
      const normalizedBrandName = normalizeValue(brand.name);

      if (!normalizedBrandName) {
        if (!brand.vendorId) {
          return undefined;
        }

        const vendorMatches = nearbyStores.filter(
          (store) => store.vendorId === brand.vendorId,
        );

        return vendorMatches.length === 1 ? vendorMatches[0] : undefined;
      }

      const exactNameMatch = nearbyStores.find(
        (store) => normalizeValue(store.name) === normalizedBrandName,
      );

      if (exactNameMatch) {
        return exactNameMatch;
      }

      const partialNameMatch = nearbyStores.find((store) =>
        isBrandStoreNameMatch(
          normalizedBrandName,
          normalizeValue(store.name),
        ),
      );

      if (partialNameMatch) {
        return partialNameMatch;
      }

      if (!brand.vendorId) {
        return undefined;
      }

      const vendorMatches = nearbyStores.filter(
        (store) => store.vendorId === brand.vendorId,
      );

      return vendorMatches.length === 1 ? vendorMatches[0] : undefined;
    },
    [nearbyStores],
  );

  const canOpenBrand = useCallback(
    (brand: DeliveryTopBrand) =>
      Boolean(resolveStoreFromBrand(brand) || brand.vendorId),
    [resolveStoreFromBrand],
  );

  const openTopBrand = useCallback(
    (brand: DeliveryTopBrand) => {
      const matchedStore = resolveStoreFromBrand(brand);

      if (matchedStore) {
        navigation.navigate('StoreDetails', { store: matchedStore });
        return;
      }

      if (!brand.vendorId) {
        return;
      }

      navigation.navigate('SeeAllScreen', {
        queryType: 'top-brand-stores',
        title: brand.name,
        cardType: 'store',
        vendorId: brand.vendorId,
      });
    },
    [navigation, resolveStoreFromBrand],
  );

  return {
    canOpenBrand,
    openTopBrand,
  };
}
