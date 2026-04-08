export type SearchLocation = {
  latitude?: number;
  longitude?: number;
};

export type SearchAddressSheetConfig = {
  addresses: import("../../account/api/profileService").ProfileAddress[];
  isLoading?: boolean;
  isVisible: boolean;
  onOpen: () => void;
  onAddAddress: () => void;
  onClose: () => void;
  onSelectAddress: (
    address: import("../../account/api/profileService").ProfileAddress,
  ) => void;
  onUseCurrentLocation: () => void;
  selectingAddressId?: string | null;
  selectedAddressId?: string;
};

export type DeliverySearchFlowOptions = {
  location?: SearchLocation;
  searchStores?: boolean;
  debounceMs?: number;
};
