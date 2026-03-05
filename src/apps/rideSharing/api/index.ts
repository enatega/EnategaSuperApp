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
    Vehicle,
    VehicleType,
} from './types';

// Query keys
export { rideKeys } from './queryKeys';

// Service
export { rideService } from './rideService';
