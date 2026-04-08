import useDeliverySearchFlow from '../../hooks/searchFlow/useDeliverySearchFlow';

export default function useSingleVendorSearchFlow() {
  return useDeliverySearchFlow({
    searchStores: false,
  });
}
