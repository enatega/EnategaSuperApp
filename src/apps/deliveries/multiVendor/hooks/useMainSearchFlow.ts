import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useDeliverySearchFlow from "../../hooks/searchFlow/useDeliverySearchFlow";
import type { DeliveriesStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<DeliveriesStackParamList>;

export default function useMainSearchFlow() {
  const navigation = useNavigation<NavigationProp>();

  return useDeliverySearchFlow({
    searchStores: true,
    onAddressPress: () => {
      navigation.navigate('AddressSearch', { origin: 'multi-vendor-home' });
    },
  });
}
