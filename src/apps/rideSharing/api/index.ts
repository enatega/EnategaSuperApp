// ---------------------------------------------------------------------------
// Barrel exports for rideSharing API layer
// ---------------------------------------------------------------------------

// API client & error
export { default as apiClient, ApiError, tokenManager } from './apiClient';

// Types
export type {
    ApiResponse,
    CreateRidePayload,
    Driver,
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
