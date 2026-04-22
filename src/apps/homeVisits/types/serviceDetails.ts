export interface HomeVisitsSingleVendorServiceBookingScreenRating {
  average: number | null;
  count: number | null;
}

export interface HomeVisitsSingleVendorServiceBookingScreenOption {
  optionId: string;
  title: string;
  description: string | null;
  price: number;
  duration: number | null;
  durationUnit: string | null;
  isDefaultSelected: boolean;
}

export interface HomeVisitsSingleVendorServiceBookingScreenSection {
  groupId: string;
  title: string;
  helperText: string | null;
  required: boolean;
  options: HomeVisitsSingleVendorServiceBookingScreenOption[];
}

export interface HomeVisitsSingleVendorServiceBookingScreenPricingSummary {
  basePrice: number;
  defaultServiceTypePrice: number;
  defaultAdditionalServicesPrice: number;
  totalPrice: number;
  serviceCount: number;
  estimatedDurationMinutes: number | null;
  estimatedDurationLabel: string | null;
}

export interface HomeVisitsSingleVendorServiceBookingScreenResponse {
  serviceId: string;
  serviceCenterId: string;
  isFavorite: boolean;
  serviceName: string;
  imageUrl: string | null;
  description: string | null;
  basePrice: number;
  rating: HomeVisitsSingleVendorServiceBookingScreenRating | null;
  serviceTypeSections: HomeVisitsSingleVendorServiceBookingScreenSection[];
  additionalServiceSections: HomeVisitsSingleVendorServiceBookingScreenSection[];
  pricingSummary: HomeVisitsSingleVendorServiceBookingScreenPricingSummary;
}

export interface HomeVisitsServiceDetailsSelectionState {
  selectedServiceTypeId: string | null;
  selectedAdditionalByGroup: Record<string, string[]>;
}

export interface HomeVisitsServiceDetailsSelectionSummary {
  totalPrice: number;
  serviceCount: number;
  estimatedDurationMinutes: number;
  estimatedDurationLabel: string | null;
}

export interface HomeVisitsServiceDetailsBookingSelectionPayload {
  serviceId: string;
  selectionState: HomeVisitsServiceDetailsSelectionState;
  summary: HomeVisitsServiceDetailsSelectionSummary;
}
