export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedAppointmentsResponse<T> {
  items: T[];
  offset: number;
  limit: number;
  total: number;
  isEnd: boolean;
  nextOffset: number | null;
}

export interface AppointmentShopType {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
}

export interface AppointmentCategory {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export type AppointmentSearchSuggestion = AppointmentCategory;

export interface AppointmentTopBrand {
  vendorId?: string;
  name: string;
  logo?: string | null;
  deal?: string | null;
  dealType?: string | null;
  dealAmount?: number | null;
}

export interface AppointmentBannerStore {
  id: string;
  address?: string | null;
  storeImage?: string | null;
  coverImage?: string | null;
}

export interface AppointmentBanner {
  id: string;
  title: string;
  description?: string | null;
  bannerVideoLink?: string | null;
  bannerImageLink?: string | null;
  relatedStore?: string | null;
  store?: AppointmentBannerStore | null;
}

export interface AppointmentProvider {
  storeId: string;
  vendorId: string;
  name: string;
  logo?: string | null;
  coverImage?: string | null;
  address?: string | null;
  shopTypeName?: string | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  distanceKm?: number | null;
  priceTier?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isAvailable?: boolean;
  deal?: string | null;
  dealType?: string | null;
  dealAmount?: number | null;
  isFavorite?: boolean;
}

export interface AppointmentStoreTimingSlot {
  open: string;
  close: string;
}

export interface AppointmentStoreTimingDay {
  slots: AppointmentStoreTimingSlot[];
  is_active: boolean;
}

export type AppointmentStoreTimings = Record<string, AppointmentStoreTimingDay>;

export interface AppointmentStoreContact {
  email?: string | null;
  phone?: string | null;
}

export interface AppointmentStoreWorker {
  workerId: string;
  profilePicture?: string | null;
  accountStatus?: string | null;
  workerName: string;
  workerProfession?: string | null;
  expertiseInService: string[];
  secondarySkills: string[];
  workerSalary?: string | null;
  storeId: string;
  storeName?: string | null;
  minWorkingHours?: number | null;
  zoneName?: string | null;
}

export interface AppointmentPublicTeamMember {
  workerId: string;
  name: string;
  profilePicture?: string | null;
  profession?: string | null;
  rating?: number | null;
  expertiseInService: string[];
  secondarySkills: string[];
  accountStatus?: string | null;
}

export interface AppointmentStoreCategory {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export interface AppointmentStoreService {
  id: string;
  name: string;
  shortDescription?: string | null;
  description?: string | null;
  durationLabel?: string | null;
  estimatedDurationMinutes?: number | null;
  unitOfMeasure?: string | null;
  price?: number | null;
  originalPrice?: number | null;
  discountedPrice?: number | null;
  deal?: AppointmentDeal | null;
  imageUrl?: string | null;
  categoryId?: string | null;
  subcategoryId?: string | null;
  category?: AppointmentStoreCategory | null;
  subcategory?: AppointmentStoreCategory | null;
}

export interface AppointmentDeal {
  id: string;
  name: string;
  type: string;
  value: number;
}

export interface AppointmentStoreView {
  id: string;
  name: string;
  address?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  deliveryTime?: number | string | null;
  minimumOrder?: number | null;
  baseFee?: number | null;
  shopTypeId?: string | null;
  shopTypeName?: string | null;
  deal?: string | null;
  dealType?: string | null;
  dealAmount?: number | null;
  tagLine?: string | null;
  description?: string | null;
  storeTimings?: AppointmentStoreTimings | null;
  latitude?: number | null;
  longitude?: number | null;
  isAvailable?: boolean;
  contact?: AppointmentStoreContact | null;
  categories: AppointmentStoreCategory[];
  subcategories: AppointmentStoreCategory[];
  team?: AppointmentPublicTeamMember[];
  isFavorite?: boolean;
}

export interface AppointmentOrderAgainItem {
  productId: string;
  storeId: string;
  productName: string;
  storeName?: string | null;
  productImage?: string | null;
  storeLogo?: string | null;
  storeImage?: string | null;
  price?: number | null;
  deal?: string | null;
  dealType?: string | null;
  dealAmount?: number | null;
  isFavorite?: boolean;
}

export interface AppointmentMostPopularItem extends AppointmentOrderAgainItem {
  orderCount: number;
  averageRating: number;
  reviewCount: number;
}

export interface AppointmentScheduledBooking {
  orderId: string;
  storeName: string;
  storeImage?: string | null;
  storeAddress?: string | null;
  storeLatitude?: number | null;
  storeLongitude?: number | null;
  scheduledAt: string;
  orderStatus: string;
  orderPrice: number;
  itemCount: number;
  durationMinutes: number;
}

export interface AppointmentScheduledBookingDetail {
  storeId: string;
  storeName: string;
  storeImage?: string | null;
  storeAddress: string;
  storeLatitude?: number | null;
  storeLongitude?: number | null;
  orderStatus: string;
  scheduledAt: string;
  durationMinutes: number;
  cancellationPolicy: string;
  canCancel: boolean;
  canReschedule: boolean;
  cancellationCutoffAt?: string | null;
  isCompleted: boolean;
  hasReview: boolean;
  assignedWorker?: {
    id: string;
    name: string;
    image?: string | null;
  } | null;
  selections: AppointmentBookingSelection[];
  items: Array<{
    name: string;
    description?: string | null;
    image?: string | null;
    quantity: number;
    price: number;
    originalPrice: number;
    durationMinutes: number;
  }>;
  summary: {
    orderNumber: string;
    subtotal: number;
    serviceFee: number;
    total: number;
    paymentMethod: string;
  };
}

export interface AppointmentPastBooking {
  orderId: string;
  storeId: string;
  storeName: string;
  storeImage?: string | null;
  storeLogo?: string | null;
  orderedAt: string;
  orderPrice: number;
  orderStatus: string;
}

export type AppointmentSeeAllSection =
  | "categories"
  | "shopTypeCategories"
  | "topBrands"
  | "nearbyProviders"
  | "orderAgain"
  | "mostPopular";

export interface AppointmentListParams {
  offset?: number;
  limit?: number;
  search?: string;
  latitude?: number;
  longitude?: number;
}

export interface AppointmentNearbyProvidersParams extends AppointmentListParams {
  search?: string;
  latitude?: number;
  longitude?: number;
  category_id?: string;
  category_ids?: string[];
  shop_type_id?: string;
  subcategory_id?: string;
  stock?: string;
  price_tiers?: string | string[];
  sort_by?: string;
}

export interface AppointmentTopBrandsParams extends AppointmentListParams {
  search?: string;
}

export interface AppointmentShopTypeCategoriesParams extends AppointmentListParams {
  shopTypeId: string;
}

export interface AppointmentOrderAgainParams extends AppointmentListParams {
  search?: string;
  category_id?: string;
  category_ids?: string[];
  shop_type_id?: string;
  subcategory_id?: string;
}

export interface AppointmentStoreServicesParams {
  storeId: string;
  offset?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
}

export type AppointmentShopTypesApiResponse =
  | ApiResponse<AppointmentShopType[]>
  | PaginatedAppointmentsResponse<AppointmentShopType>
  | AppointmentShopType[];

export type AppointmentCategoriesApiResponse =
  | ApiResponse<AppointmentCategory[]>
  | PaginatedAppointmentsResponse<AppointmentCategory>
  | AppointmentCategory[];

export type AppointmentSearchSuggestionsApiResponse =
  | ApiResponse<AppointmentSearchSuggestion[]>
  | PaginatedAppointmentsResponse<AppointmentSearchSuggestion>
  | AppointmentSearchSuggestion[];

export type AppointmentBannersApiResponse =
  PaginatedAppointmentsResponse<AppointmentBanner>;

export type AppointmentTopBrandsApiResponse =
  | ApiResponse<AppointmentTopBrand[]>
  | PaginatedAppointmentsResponse<AppointmentTopBrand>
  | AppointmentTopBrand[];

export type AppointmentBrandsApiResponse =
  | ApiResponse<AppointmentProvider[]>
  | PaginatedAppointmentsResponse<AppointmentProvider>
  | AppointmentProvider[];

export type AppointmentNearbyProvidersApiResponse =
  | ApiResponse<AppointmentProvider[]>
  | PaginatedAppointmentsResponse<AppointmentProvider>
  | AppointmentProvider[];

export type AppointmentOrderAgainApiResponse =
  | ApiResponse<AppointmentOrderAgainItem[]>
  | PaginatedAppointmentsResponse<AppointmentOrderAgainItem>
  | AppointmentOrderAgainItem[];

export type AppointmentMostPopularApiResponse =
  | ApiResponse<AppointmentMostPopularItem[]>
  | PaginatedAppointmentsResponse<AppointmentMostPopularItem>
  | AppointmentMostPopularItem[];

export type AppointmentStoreViewApiResponse = AppointmentStoreView;

export type AppointmentStoreServicesApiResponse =
  PaginatedAppointmentsResponse<AppointmentStoreService>;

export interface AppointmentStoreWorkersApiResponse {
  data: Array<{
    worker_id: string;
    profile_picture?: string | null;
    account_status?: string | null;
    worker_name: string;
    worker_profession?: string | null;
    expertise_in_service?: string[];
    secondary_skills?: string[];
    worker_salary?: string | null;
    store_id: string;
    store_name?: string | null;
    min_working_hours?: number | null;
    zone_name?: string | null;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AppointmentBookingSelectionOption {
  groupId?: string;
  optionId: string;
}

export interface AppointmentBookingSelection {
  serviceId: string;
  selectedOptions?: AppointmentBookingSelectionOption[];
}

export interface AppointmentCartSelectedOption {
  groupId: string;
  groupName: string;
  groupType?: string | null;
  imageUrl?: string | null;
  replacesBasePrice?: boolean;
  optionId: string;
  optionName: string;
  price: number;
}

export interface AppointmentCartItem {
  id: string;
  productId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  estimatedDurationMinutes: number | null;
  quantity: number;
  basePrice: number;
  originalUnitPrice: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
  deal: AppointmentDeal | null;
  selectedOptions: AppointmentCartSelectedOption[];
  storeId: string;
  inStock: boolean;
}

export interface AppointmentCartResponse {
  bucketId: string | null;
  customerId: string;
  status: string;
  storeId: string | null;
  totalItems: number;
  uniqueItems: number;
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  isEmpty: boolean;
  items: AppointmentCartItem[];
  message?: string[];
}

export interface AppointmentCartCountResponse {
  bucketId: string | null;
  totalItems: number;
  uniqueItems: number;
  isEmpty: boolean;
}

export interface AppointmentCartSyncRequest {
  storeId: string;
  selections: AppointmentBookingSelection[];
  replaceExistingStore?: boolean;
}

export interface AppointmentServiceCustomizationSection {
  groupId: string;
  name: string;
  imageUrl?: string | null;
  type?: string | null;
  durationMinutes?: number | null;
  required: boolean;
  selectionType?: 'single' | 'multi' | null;
  dependsOnVariationOptionId?: string | null;
  options: Array<{
    optionId: string;
    title: string;
    price: number;
    defaultSelected: boolean;
  }>;
}

export interface AppointmentMobileServiceDetail {
  serviceId: string;
  imageUrl?: string | null;
  deal?: AppointmentDeal | null;
  customizationSections: AppointmentServiceCustomizationSection[];
}

export interface AppointmentBookingAvailabilityRequest {
  storeId: string;
  date: string;
  selections: AppointmentBookingSelection[];
  workerId?: string;
  excludeOrderId?: string;
}

export interface AppointmentBookingRescheduleRequest {
  orderId: string;
  scheduledAt: string;
}

export interface AppointmentBookingCancelResponse {
  orderId: string;
  status: string;
  cancelled: boolean;
}

export interface AppointmentBookingRatingRequest {
  orderId: string;
  storeRating: number;
  storeReview?: string;
  workerRating: number;
  workerReview?: string;
}

export interface AppointmentBookingRatingResponse {
  orderId: string;
  reviewed: boolean;
}

export interface AppointmentBookingAvailabilitySlot {
  startAt: string;
  endAt: string;
  label: string;
  availableWorkerCount: number;
  workerIds: string[];
}

export interface AppointmentBookingAvailabilityResponse {
  store: {
    id: string;
    name: string;
    address?: string | null;
  };
  summary: {
    serviceCount: number;
    totalDurationMinutes: number;
    originalSubtotal: number;
    discountAmount: number;
    subtotal: number;
  };
  workers: {
    mode: "any" | "specific";
    eligibleCount: number;
  };
  date: string;
  slots: AppointmentBookingAvailabilitySlot[];
}

export type AppointmentBookingWorkerMode = "any" | "specific";

export interface AppointmentBookingReviewRequest {
  storeId: string;
  selections: AppointmentBookingSelection[];
  scheduledAt: string;
  workerMode: AppointmentBookingWorkerMode;
  workerId?: string;
  customerNote?: string;
  couponCode?: string;
}

export interface AppointmentBookingReviewResponse {
  hold: {
    token: string;
    expiresAt: string;
  };
  store: {
    id: string;
    name: string;
    address?: string | null;
    image?: string | null;
    reviewCount: number;
  };
  appointment: {
    scheduledAt: string;
    durationMinutes: number;
    durationLabel: string;
  };
  worker: {
    id: string;
    name: string;
    profilePicture?: string | null;
    profession?: string | null;
    rating?: number | null;
    mode: AppointmentBookingWorkerMode;
  } | null;
  items: Array<{
    serviceId: string;
    name: string;
    originalPrice: number;
    price: number;
    discountedPrice: number | null;
    discountAmount: number;
    deal: AppointmentDeal | null;
    durationMinutes: number;
    durationLabel: string;
    selectedOptions: Array<{
      groupId: string;
      groupName: string;
      optionId: string;
      optionName: string;
      price: number;
      durationMinutes: number;
    }>;
  }>;
  payment: {
    codAllowed: boolean;
    stripeAllowed: boolean;
  };
  cancellationPolicy: string;
  customerNote?: string | null;
  totals: {
    subtotal: number;
    dealDiscount?: number;
    couponDiscount?: number;
    discount: number;
    total: number;
    serviceCount: number;
    durationLabel: string;
  };
  coupon?: {
    id: string;
    code: string;
    name: string;
    discountAmount: number;
  } | null;
}

export interface AppointmentBookingConfirmRequest extends AppointmentBookingReviewRequest {
  holdToken: string;
  paymentMethod: "cod" | "stripe";
  addressId?: string;
}

export interface AppointmentBookingConfirmResponse {
  mode: string;
  orderId: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  orderType: string;
  totalAmount: number;
  scheduledAt: string;
  createdAt: string;
  worker: {
    id: string;
    name: string;
    profession?: string | null;
  };
  appointment: {
    scheduledAt: string;
    totalDurationMinutes: number;
    subtotal: number;
  };
}
