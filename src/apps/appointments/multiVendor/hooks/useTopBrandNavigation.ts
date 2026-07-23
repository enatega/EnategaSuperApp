import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type {
  AppointmentProvider,
  AppointmentTopBrand,
} from '../../api/types';
import {
  useAppointmentBrands,
  useAppointmentNearbyProviders,
} from '../../hooks/useDiscoveryQueries';
import type { MultiVendorStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<MultiVendorStackParamList>;

function normalizeValue(value?: string | null) {
  return value?.trim().toLowerCase() ?? '';
}

function isBrandProviderNameMatch(brandName: string, providerName: string) {
  return (
    providerName === brandName ||
    providerName.includes(brandName) ||
    brandName.includes(providerName)
  );
}

export default function useTopBrandNavigation() {
  const navigation = useNavigation<NavigationProp>();
  const { data: allBrands = [] } = useAppointmentBrands({ limit: 100 });
  const { data: nearbyProviders = [] } = useAppointmentNearbyProviders({ limit: 20 });
  const candidateProviders = [...allBrands, ...nearbyProviders];

  const resolveProviderFromBrand = useCallback(
    (brand: AppointmentTopBrand): AppointmentProvider | undefined => {
      const normalizedBrandName = normalizeValue(brand.name);

      if (!normalizedBrandName) {
        if (!brand.vendorId) {
          return undefined;
        }

        const vendorMatches = candidateProviders.filter(
          (provider) => provider.vendorId === brand.vendorId,
        );

        return vendorMatches[0];
      }

      const exactNameMatch = candidateProviders.find(
        (provider) => normalizeValue(provider.name) === normalizedBrandName,
      );

      if (exactNameMatch) {
        return exactNameMatch;
      }

      const partialNameMatch = candidateProviders.find((provider) =>
        isBrandProviderNameMatch(
          normalizedBrandName,
          normalizeValue(provider.name),
        ),
      );

      if (partialNameMatch) {
        return partialNameMatch;
      }

      if (!brand.vendorId) {
        return undefined;
      }

      const vendorMatches = candidateProviders.filter(
        (provider) => provider.vendorId === brand.vendorId,
      );

      return vendorMatches[0];
    },
    [candidateProviders],
  );

  const canOpenBrand = useCallback(
    (brand: AppointmentTopBrand) => Boolean(resolveProviderFromBrand(brand)?.storeId),
    [resolveProviderFromBrand],
  );

  const openTopBrand = useCallback(
    (brand: AppointmentTopBrand) => {
      const matchedProvider = resolveProviderFromBrand(brand);

      if (!matchedProvider?.storeId) {
        return;
      }

      navigation.navigate('MultiVendorDetails', {
        provider: matchedProvider,
        brand,
      });
    },
    [navigation, resolveProviderFromBrand],
  );

  return {
    canOpenBrand,
    openTopBrand,
  };
}
