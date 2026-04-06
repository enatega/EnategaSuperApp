import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useDeliverySearchFlow from '../../hooks/searchFlow/useDeliverySearchFlow';
import type { SingleVendorStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<SingleVendorStackParamList>;

export default function useSingleVendorSearchFlow() {
  const navigation = useNavigation<NavigationProp>();

  return useDeliverySearchFlow({
    searchStores: false,
    onAddressPress: () => {
      navigation.navigate('AddressSearch', { origin: 'single-vendor-home' });
    },
  });
}
