export type SearchLocation = {
  latitude?: number;
  longitude?: number;
};

export type DeliverySearchFlowOptions = {
  location?: SearchLocation;
  searchStores?: boolean;
  debounceMs?: number;
  onAddressPress?: () => void;
};

export const DEFAULT_SEARCH_LOCATION: SearchLocation = {
  latitude: 31.5766,
  longitude: 74.33625,
}
