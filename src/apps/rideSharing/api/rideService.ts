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
    ActiveRideRequestResponse,
    AcceptRideBidParams,
    RaiseRideFarePayload,
    RaiseRideFareResponse,
    RejectRideBidParams,
    RidePlacePrediction,
    RidePlaceCoordinates,
    DistanceMatrixResponse,
    CustomerRidesResponse,
    CustomerRideDetail,
    NearbyDriver,
    SubmitRideReviewPayload,
    ActiveRidePayload,
    RiderVehicleInfo,
} from './types';

// ---------------------------------------------------------------------------
// Ride Service – all HTTP calls live here (never in components/hooks directly)
// ---------------------------------------------------------------------------

export const rideService = {
    // Accept both `{ data: ... }` and raw payload responses while the backend contracts settle.
    unwrapData<T>(response: ApiResponse<T> | T): T {
        if (
            response
            && typeof response === 'object'
            && 'data' in (response as Record<string, unknown>)
        ) {
            return (response as ApiResponse<T>).data;
        }

        return response as T;
    },

    normalizeNearbyDrivers(rawDrivers: unknown): NearbyDriver[] {
        if (!Array.isArray(rawDrivers)) {
            return [];
        }

        return rawDrivers.flatMap((item): NearbyDriver[] => {
            if (!item || typeof item !== 'object') {
                return [];
            }

            const record = item as Record<string, unknown>;
            const user = record.user && typeof record.user === 'object'
                ? record.user as Record<string, unknown>
                : null;
            const currentLocation = user?.current_location && typeof user.current_location === 'object'
                ? user.current_location as Record<string, unknown>
                : null;

            const idCandidate = [
                record.id,
                user?.id,
                record.driverId,
                record.riderId,
            ].find((value) => typeof value === 'string' && value.trim().length > 0);
            const id = typeof idCandidate === 'string' ? idCandidate : undefined;

            const latitudeSource = [
                currentLocation?.latitude,
                currentLocation?.lat,
                record.latitude,
                record.lat,
            ].find((value) => value !== null && value !== undefined);
            const longitudeSource = [
                currentLocation?.longitude,
                currentLocation?.lng,
                currentLocation?.lon,
                record.longitude,
                record.lng,
                record.lon,
            ].find((value) => value !== null && value !== undefined);
            const latitude = Number(latitudeSource);
            const longitude = Number(longitudeSource);

            if (!id || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
                return [];
            }

            const headingSource = [
                currentLocation?.heading,
                record.heading,
            ].find((value) => value !== null && value !== undefined);
            const heading = headingSource === undefined ? undefined : Number(headingSource);
            const name = typeof user?.name === 'string' ? user.name : undefined;
            const vehicleType = typeof record.vehicle_type === 'string'
                ? record.vehicle_type
                : typeof record.vehicleType === 'string'
                    ? record.vehicleType
                    : undefined;

            return [{
                id,
                latitude,
                longitude,
                heading: Number.isFinite(heading) ? heading : undefined,
                name,
                vehicleType,
            }];
        });
    },

    normalizeRiderVehicleInfo(rawVehicle: unknown): RiderVehicleInfo {
        if (!rawVehicle || typeof rawVehicle !== 'object') {
            return {
                vehicleName: null,
                vehicleNo: null,
                vehicleColor: null,
            };
        }

        const rootRecord = rawVehicle as Record<string, unknown>;
        const nestedVehicleCandidate = (
            rootRecord.data
            && typeof rootRecord.data === 'object'
                ? rootRecord.data
                : rootRecord.vehicle
                && typeof rootRecord.vehicle === 'object'
                    ? rootRecord.vehicle
                    : rootRecord
        ) as Record<string, unknown>;
        const readString = (...values: Array<unknown>) => {
            for (const value of values) {
                if (typeof value === 'string' && value.trim().length > 0) {
                    return value.trim();
                }
            }

            return null;
        };

        return {
            vehicleName: readString(
                nestedVehicleCandidate.vehicleName,
                nestedVehicleCandidate.vehicle_name,
                nestedVehicleCandidate.name,
                nestedVehicleCandidate.model,
            ),
            vehicleNo: readString(
                nestedVehicleCandidate.vehicleNo,
                nestedVehicleCandidate.vehicle_no,
                nestedVehicleCandidate.no,
                nestedVehicleCandidate.licensePlate,
                nestedVehicleCandidate.license_plate,
            ),
            vehicleColor: readString(
                nestedVehicleCandidate.vehicleColor,
                nestedVehicleCandidate.vehicle_color,
                nestedVehicleCandidate.colour,
                nestedVehicleCandidate.color,
            ),
        };
    },

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

    /** Fetch nearby available drivers around a map center. */
    getNearbyDrivers: async (
        latitude: number,
        longitude: number,
        radiusKm: number = 7,
    ): Promise<NearbyDriver[]> => {
        const response = await apiClient.get<unknown>(
            `/api/v1/rides/drivers/nearby/${latitude}/${longitude}/${radiusKm}`,
            undefined,
        );

        return rideService.normalizeNearbyDrivers(response);
    },

    /** Fetch active (in-progress / accepted) ride, if any. */
    getActiveRide: async (): Promise<ActiveRidePayload | null> => {
        const response = await apiClient.get<ApiResponse<ActiveRidePayload | null> | ActiveRidePayload | null>(
            '/api/v1/rides/ongoing/active/customer',
        );
        return rideService.unwrapData(response);
    },

    /** Fetch active ride request when a driver has not been assigned yet. */
    getActiveRideRequest: (): Promise<ActiveRideRequestResponse> =>
        apiClient.get<ActiveRideRequestResponse>('/api/v1/rides/ride-request/active'),

    // ── Mutations ─────────────────────────────────────────────────────────

    /** Request a new ride. */
    createRide: async (payload: CreateRidePayload): Promise<RideDetails> => {
        const response = await apiClient.post<ApiResponse<RideDetails> | RideDetails>(
            '/api/v1/rides',
            payload,
        );
        return rideService.unwrapData(response);
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
        apiClient.patch(`/api/v1/rides/${rideId}/customer/cancel`),

    /** Cancel a pending ride request before a ride is accepted. */
    cancelRideRequest: (rideId: string): Promise<void> =>
        apiClient.patch(`/api/v1/rides/${rideId}/cancel`),

    /** Raise fare for an active ride request and continue searching. */
    raiseRideFare: async (
        payload: RaiseRideFarePayload,
    ): Promise<RaiseRideFareResponse> => {
        const response = await apiClient.patch<RaiseRideFareResponse>(
            '/api/v1/rides/ride-request/raise-fare',
            payload,
        );

        return response;
    },

    /** Accept a driver's bid for an active ride request. */
    acceptRideBid: async ({
        rideBidId,
        payload,
    }: AcceptRideBidParams): Promise<unknown> =>
        apiClient.patch(`/api/v1/rides/bids/${rideBidId}/accept`, payload),

    /** Reject a driver's bid for an active ride request. */
    rejectRideBid: async ({
        rideBidId,
    }: RejectRideBidParams): Promise<unknown> =>
        apiClient.patch(`/api/v1/rides/bids/${rideBidId}/reject`),

    /** Submit a customer review for a completed ride. */
    submitRideReview: (payload: SubmitRideReviewPayload): Promise<unknown> =>
        apiClient.post('/api/v1/reviews', payload),

    /** Fetch profile stats for a driver/rider by userId. */
    getDriverStats: (userId: string): Promise<DriverProfileStats> =>
        apiClient.get<DriverProfileStats>(`api/v1/rides/get-stats/${userId}`),

    /** Fetch rider vehicle details by riderId. */
    getRiderVehicleInfo: async (riderId: string): Promise<RiderVehicleInfo> => {
        const response = await apiClient.get<unknown>(`/api/v1/ride-vehicles/rider/${riderId}/vehicle-info`);
        return rideService.normalizeRiderVehicleInfo(response);
    },

    /** Fetch customer rides history. */
    getCustomerRides: (offset: number = 0, limit: number = 10): Promise<CustomerRidesResponse> =>
        apiClient.get<CustomerRidesResponse>('/api/v1/rides/customers', { offset, limit }),

    /** Fetch scheduled customer rides for reservations. */
    getCustomerScheduledRides: (offset: number = 0, limit: number = 10): Promise<CustomerRidesResponse> =>
        apiClient.get<CustomerRidesResponse>('/api/v1/rides/customer/scheduled', { offset, limit }),

    /** Fetch single customer ride detail. */
    getCustomerRideDetail: (rideId: string): Promise<CustomerRideDetail> =>
        apiClient.get<{ data: CustomerRideDetail }>(`/api/v1/rides/${rideId}/details/customer`)
            .then((res) => res.data),
};
