import useHomeVisitsSearchFlow from "../../hooks/searchFlow/useHomeVisitsSearchFlow";

export default function useSingleVendorSearchFlow() {
  return useHomeVisitsSearchFlow({
    searchServiceCenters: false,
  });
}
