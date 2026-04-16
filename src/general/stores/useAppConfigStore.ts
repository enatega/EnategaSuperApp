import { create } from 'zustand';

export type AppCurrency = {
  id: string;
  code: string;
  name: string;
  symbol: string;
  rateToBase: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GlobalEmergencyContact = {
  id: string;
  title: string;
  contact_number: string;
  is_active: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
};

type AppConfigStatus = {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
};

type RideSharingAppConfigState = AppConfigStatus & {
  currency: AppCurrency | null;
  emergencyContact: GlobalEmergencyContact | null;
};

export type DeliveryPlatformType =
  | 'SINGLE_VENDOR'
  | 'MULTI_VENDOR'
  | 'STORE_CHAIN';

export type DeliveriesPlatformConfiguration = {
  id: string;
  platform_type: DeliveryPlatformType;
  created_at: string;
  updated_at: string;
};

export type DeliveryMode = 'singleVendor' | 'multiVendor' | 'chain';

type DeliveriesAppConfigState = AppConfigStatus & {
  platformConfiguration: DeliveriesPlatformConfiguration | null;
  deliveryMode: DeliveryMode | null;
  currency: AppCurrency | null;
};

type AppConfigState = {
  rideSharing: RideSharingAppConfigState;
  deliveries: DeliveriesAppConfigState;
  setRideSharingCurrency: (currency: AppCurrency | null) => void;
  setRideSharingEmergencyContact: (
    emergencyContact: GlobalEmergencyContact | null,
  ) => void;
  setRideSharingConfigLoading: (isLoading: boolean) => void;
  setRideSharingConfigError: (error: string | null) => void;
  markRideSharingConfigLoaded: () => void;
  resetRideSharingConfig: () => void;
  setDeliveriesPlatformConfiguration: (
    platformConfiguration: DeliveriesPlatformConfiguration | null,
  ) => void;
  setDeliveriesDeliveryMode: (deliveryMode: DeliveryMode | null) => void;
  setDeliveriesCurrency: (currency: AppCurrency | null) => void;
  setDeliveriesConfigLoading: (isLoading: boolean) => void;
  setDeliveriesConfigError: (error: string | null) => void;
  markDeliveriesConfigLoaded: () => void;
  resetDeliveriesConfig: () => void;
};

const initialRideSharingConfigState: RideSharingAppConfigState = {
  currency: null,
  emergencyContact: null,
  isLoading: false,
  isLoaded: false,
  error: null,
};

const initialDeliveriesConfigState: DeliveriesAppConfigState = {
  platformConfiguration: null,
  deliveryMode: null,
  currency: null,
  isLoading: false,
  isLoaded: false,
  error: null,
};

export const useAppConfigStore = create<AppConfigState>((set) => ({
  rideSharing: initialRideSharingConfigState,
  deliveries: initialDeliveriesConfigState,

  setRideSharingCurrency: (currency) =>
    set((state) => ({
      rideSharing: {
        ...state.rideSharing,
        currency,
        error: null,
      },
    })),

  setRideSharingEmergencyContact: (emergencyContact) =>
    set((state) => ({
      rideSharing: {
        ...state.rideSharing,
        emergencyContact,
        error: null,
      },
    })),

  setRideSharingConfigLoading: (isLoading) =>
    set((state) => ({
      rideSharing: {
        ...state.rideSharing,
        isLoading,
      },
    })),

  setRideSharingConfigError: (error) =>
    set((state) => ({
      rideSharing: {
        ...state.rideSharing,
        error,
      },
    })),

  markRideSharingConfigLoaded: () =>
    set((state) => ({
      rideSharing: {
        ...state.rideSharing,
        isLoaded: true,
      },
    })),

  resetRideSharingConfig: () =>
    set({
      rideSharing: initialRideSharingConfigState,
    }),

  setDeliveriesPlatformConfiguration: (platformConfiguration) =>
    set((state) => ({
      deliveries: {
        ...state.deliveries,
        platformConfiguration,
        error: null,
      },
    })),

  setDeliveriesDeliveryMode: (deliveryMode) =>
    set((state) => ({
      deliveries: {
        ...state.deliveries,
        deliveryMode,
      },
    })),

  setDeliveriesCurrency: (currency) =>
    set((state) => ({
      deliveries: {
        ...state.deliveries,
        currency,
        error: null,
      },
    })),

  setDeliveriesConfigLoading: (isLoading) =>
    set((state) => ({
      deliveries: {
        ...state.deliveries,
        isLoading,
      },
    })),

  setDeliveriesConfigError: (error) =>
    set((state) => ({
      deliveries: {
        ...state.deliveries,
        error,
      },
    })),

  markDeliveriesConfigLoaded: () =>
    set((state) => ({
      deliveries: {
        ...state.deliveries,
        isLoaded: true,
      },
    })),

  resetDeliveriesConfig: () =>
    set({
      deliveries: initialDeliveriesConfigState,
    }),
}));

function resolveCurrencyDisplayValue(currency: AppCurrency | null) {
  return currency?.symbol?.trim() || currency?.code || 'QAR';
}

function resolveCurrencyCodeValue(currency: AppCurrency | null) {
  return currency?.code || 'QAR';
}

export function useRideSharingCurrency() {
  return useAppConfigStore((state) => state.rideSharing.currency);
}

export function useRideSharingEmergencyContact() {
  return useAppConfigStore((state) => state.rideSharing.emergencyContact);
}

export function useRideSharingCurrencyLabel() {
  const currency = useRideSharingCurrency();
  return resolveCurrencyDisplayValue(currency);
}

export function useRideSharingCurrencyCode() {
  const currency = useRideSharingCurrency();
  return resolveCurrencyCodeValue(currency);
}

export function getRideSharingCurrencyLabel() {
  return resolveCurrencyDisplayValue(useAppConfigStore.getState().rideSharing.currency);
}

export function getRideSharingCurrencyCode() {
  return resolveCurrencyCodeValue(useAppConfigStore.getState().rideSharing.currency);
}

export function mapPlatformTypeToDeliveryMode(
  platformType: DeliveryPlatformType,
): DeliveryMode {
  switch (platformType) {
    case 'MULTI_VENDOR':
      return 'multiVendor';
    case 'STORE_CHAIN':
      return 'chain';
    case 'SINGLE_VENDOR':
    default:
      return 'singleVendor';
  }
}

export function useDeliveriesPlatformConfiguration() {
  return useAppConfigStore((state) => state.deliveries.platformConfiguration);
}

export function useDeliveriesDeliveryMode() {
  return useAppConfigStore((state) => state.deliveries.deliveryMode);
}

export function useDeliveriesCurrency() {
  return useAppConfigStore((state) => state.deliveries.currency);
}

export function useDeliveriesCurrencyLabel() {
  const currency = useDeliveriesCurrency();
  return resolveCurrencyDisplayValue(currency);
}

export function useDeliveriesCurrencyCode() {
  const currency = useDeliveriesCurrency();
  return resolveCurrencyCodeValue(currency);
}

export function getDeliveriesCurrencyLabel() {
  return resolveCurrencyDisplayValue(useAppConfigStore.getState().deliveries.currency);
}

export function getDeliveriesCurrencyCode() {
  return resolveCurrencyCodeValue(useAppConfigStore.getState().deliveries.currency);
}
