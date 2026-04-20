import useDeliverySearchFlow from "../../../deliveries/hooks/searchFlow/useDeliverySearchFlow";

export default function useSingleVendorSearchFlow() {
  return useDeliverySearchFlow({
    searchStores: false,
  });
}
