import { useAddressStore } from '../stores/useAddressStore';
import { formatDeliveryAddressLabel } from '../utils/address';

export type { DeliveryAddress } from '../api/addressService';

export default function useAddress() {
  const selectedAddress = useAddressStore((state) => state.selectedAddress);
  const setSelectedAddress = useAddressStore(
    (state) => state.setSelectedAddress,
  );
  const clearSelectedAddress = useAddressStore(
    (state) => state.clearSelectedAddress,
  );

  return {
    selectedAddress,
    selectedAddressLabel: formatDeliveryAddressLabel(selectedAddress),
    latitude: selectedAddress?.latitude,
    longitude: selectedAddress?.longitude,
    setSelectedAddress,
    clearSelectedAddress,
  };
}
