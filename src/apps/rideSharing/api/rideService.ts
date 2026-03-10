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
    RideFareResponse,
    RideTypeFare,
    RideTypeFareParams,
    RideTypeCatalogItem,
    RidePlacePrediction,
    RidePlaceCoordinates,
    DistanceMatrixResponse,
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

    /** Fetch ride type fares (used to render available ride types). */
    getRideTypeFares: async (
        params: RideTypeFareParams,
    ): Promise<RideTypeFare[]> => {
        const response = await apiClient.get<RideFareResponse>(
            '/api/v1/rides/fare/all',
            params as Record<string, unknown>,
            { skipAuth: true },
        );
        return response.rideTypeFares ?? [];
    },

    /** Fetch active ride types catalog for ride options. */
    getRideTypes: async (): Promise<RideTypeCatalogItem[]> => {
        const response = await apiClient.get<RideTypeCatalogItem[]>(
            '/api/v1/ride-types',
            undefined,
            { skipAuth: true },
        );

        return Array.isArray(response) ? response.filter((item) => item.isActive) : [];
    },

    /** Search place suggestions through backend Google proxy. */
    searchPlaces: (input: string): Promise<RidePlacePrediction[]> =>
        apiClient.post<RidePlacePrediction[]>(
            '/api/v1/maps/places',
            { input },
            { skipAuth: true },
        ),

    /** Resolve a Google place id to lat/lng through backend proxy. */
    getPlaceDetails: (placeId: string): Promise<RidePlaceCoordinates> =>
        apiClient.post<RidePlaceCoordinates>(
            '/api/v1/maps/place-details',
            { placeId },
            { skipAuth: true },
        ),

    /** Fetch distance + duration between origin and destination. */
    getDistanceMatrix: (
        origins: string[],
        destinations: string[],
    ): Promise<DistanceMatrixResponse> =>
        apiClient.post<DistanceMatrixResponse>(
            '/api/v1/maps/distance-matrix',
            { origins, destinations },
            { skipAuth: true },
        ),

    /** Fetch route polyline path through backend proxy. */
    getRoutePath: async (
        origin: { lat: number; lng: number },
        destination: { lat: number; lng: number },
    ): Promise<Array<{ latitude: number; longitude: number }>> => {
        const response = await apiClient.get<{ path?: [number, number][] }>(
            '/api/v1/maps/route',
            {
                originLat: origin.lat,
                originLng: origin.lng,
                destinationLat: destination.lat,
                destinationLng: destination.lng,
            },
            { skipAuth: true },
        );

        if (!Array.isArray(response.path)) {
            return [];
        }

        return response.path.map(([latitude, longitude]) => ({
            latitude,
            longitude,
        }));
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
