// ---------------------------------------------------------------------------
// Barrel exports for rideSharing API layer
// ---------------------------------------------------------------------------

// API client & error
export { default as apiClient, ApiError, tokenManager } from '../../../general/api/apiClient';

// Types
export type {
    ApiResponse,
    CreateRidePayload,
    Driver,
    DriverProfileStats,
    DriverVehicle,
    DriverProfileInfo,
    DriverRatingBreakdown,
    DriverReview,
    Location,
    PaginatedResponse,
    Ride,
    RideDetails,
    RideEstimate,
    RideEstimatePayload,
    RideFilters,
    RideStatus,
    UpdateRidePayload,
    UserApiData,
    UserApiResponse,
    Vehicle,
    VehicleType,
} from './types';

// Query keys (single source of truth)
export { rideKeys, userKeys } from './queryKeys';

// Ride service
export { rideService } from './rideService';
export { rideChatService } from './rideChatService';
export type {
    RideChatBoxRecord,
    RideChatBoxesResponse,
    RideChatMessageRecord,
    RideChatMessagesResponse,
    RideChatParticipant,
    SendRideChatMessagePayload,
    SendRideChatMessageResponse,
} from './rideChatServiceTypes';

// User service
export { userService } from './userService';
export type {
    UserNotificationItem,
    UserNotificationsQueryParams,
    UserNotificationsResponse,
} from './userService';
