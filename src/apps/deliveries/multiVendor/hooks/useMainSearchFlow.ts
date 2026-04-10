import useDeliverySearchFlow from "../../hooks/searchFlow/useDeliverySearchFlow";

export default function useMainSearchFlow() {
  return useDeliverySearchFlow({
    searchStores: true,
  });
}
