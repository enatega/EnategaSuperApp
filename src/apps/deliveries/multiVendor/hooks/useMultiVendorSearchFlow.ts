import useDeliverySearchFlow from "../../hooks/searchFlow/useDeliverySearchFlow";

export default function useMultiVendorSearchFlow() {
  return useDeliverySearchFlow({
    searchStores: true,
  });
}
