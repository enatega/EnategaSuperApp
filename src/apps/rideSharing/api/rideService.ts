import apiClient from '../../../general/api/apiClient';
import type {
    ApiResponse,
    CreateRidePayload,
    DriverProfileStats,
    PaginatedResponse,
    Ride,
    RideDetails,
    RideEstimate,
    RideEstimatePayload,
    RideFilters,
    UpdateRidePayload,
} from './types';

// ---------------------------------------------------------------------------
// Ride Service – all HTTP calls live here (never in components/hooks directly)
// ---------------------------------------------------------------------------

export const rideService = {
    // ── Queries ───────────────────────────────────────────────────────────

    /** Fetch a paginated list of rides, optionally filtered. */
    getRides: (filters?: RideFilters): Promise<PaginatedResponse<Ride>> =>
        apiClient.get<PaginatedResponse<Ride>>('/rides', filters as Record<string, unknown>),

    /** Fetch full details for a single ride. */
    getRideById: async (rideId: string): Promise<RideDetails> => {
        const response = await apiClient.get<ApiResponse<RideDetails>>(
            `/rides/${rideId}`,
        );
        return response.data;
    },

    /** Get fare estimates for a pickup → dropoff pair. */
    getEstimates: async (
        payload: RideEstimatePayload,
    ): Promise<RideEstimate[]> => {
        const response = await apiClient.post<ApiResponse<RideEstimate[]>>(
            '/rides/estimate',
            payload,
        );
        return response.data;
    },

    /** Fetch active (in-progress / accepted) ride, if any. */
    getActiveRide: async (): Promise<RideDetails | null> => {
        const response = await apiClient.get<ApiResponse<RideDetails | null>>(
            '/rides/active',
        );
        return response.data;
    },

    // ── Mutations ─────────────────────────────────────────────────────────

    /** Request a new ride. */
    createRide: async (payload: CreateRidePayload): Promise<RideDetails> => {
        const response = await apiClient.post<ApiResponse<RideDetails>>(
            '/rides',
            payload,
        );
        return response.data;
    },

    /** Update a ride (status change, rating, etc.). */
    updateRide: async ({
        rideId,
        ...payload
    }: UpdateRidePayload): Promise<RideDetails> => {
        const response = await apiClient.patch<ApiResponse<RideDetails>>(
            `/rides/${rideId}`,
            payload,
        );
        return response.data;
    },

    /** Cancel a ride. */
    cancelRide: (rideId: string): Promise<void> =>
        apiClient.post(`/rides/${rideId}/cancel`),

    /** Rate a completed ride. */
    rateRide: (
        rideId: string,
        rating: number,
        feedback?: string,
    ): Promise<void> =>
        apiClient.post(`/rides/${rideId}/rate`, { rating, feedback }),

    /** Fetch profile stats for a driver/rider by userId. */
    getDriverStats: (userId: string): Promise<DriverProfileStats> =>
        apiClient.get<DriverProfileStats>(`api/v1/rides/get-stats/${userId}`),
};
