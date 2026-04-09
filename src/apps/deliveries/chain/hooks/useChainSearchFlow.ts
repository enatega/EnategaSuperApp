import useDeliverySearchFlow from "../../hooks/searchFlow/useDeliverySearchFlow";

export default function useChainSearchFlow() {
  return useDeliverySearchFlow({
    searchStores: false,
  });
}
