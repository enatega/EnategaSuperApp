import {
    useQuery,
    useQueryClient,
    UseQueryOptions,
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    InfiniteData,
} from '@tanstack/react-query';
import { rideKeys } from '../api/queryKeys';
import { rideService } from '../api/rideService';
import type {
    DriverProfileStats,
    PaginatedResponse,
    Ride,
    RideDetails,
    RideEstimate,
    RideEstimatePayload,
    RideFilters,
    RideTypeCatalogItem,
    RideTypeFare,
    RideTypeFareParams,
    CustomerRidesResponse,
    CustomerRideDetail,
    NearbyDriver,
    ActiveRidePayload,
    RiderVehicleInfo,
} from '../api/types';
import { ApiError } from '../../../general/api/apiClient';

// ---------------------------------------------------------------------------
// useRides – paginated ride list
//  • staleTime 1 min (user-generated content)
//  • keepPreviousData for smooth pagination transitions
// ---------------------------------------------------------------------------

type UseRidesOptions = Omit<
    UseQueryOptions<PaginatedResponse<Ride>, ApiError>,
    'queryKey' | 'queryFn'
>;

export function useRides(filters?: RideFilters, options?: UseRidesOptions) {
    return useQuery<PaginatedResponse<Ride>, ApiError>({
        queryKey: rideKeys.list(filters),
        queryFn: () => rideService.getRides(filters),
        staleTime: 1 * 60 * 1000, // 1 minute
        ...options,
    });
}

// ---------------------------------------------------------------------------
// useRideDetails – single ride with full info
//  • staleTime 30 s (ride data changes frequently when active)
//  • enabled defaults to !!rideId so it doesn't fire on undefined
// ---------------------------------------------------------------------------

type UseRideDetailsOptions = Omit<
    UseQueryOptions<RideDetails, ApiError>,
    'queryKey' | 'queryFn'
>;

export function useRideDetails(
    rideId: string | undefined,
    options?: UseRideDetailsOptions,
) {
    return useQuery<RideDetails, ApiError>({
        queryKey: rideKeys.detail(rideId!),
        queryFn: () => rideService.getRideById(rideId!),
        staleTime: 30 * 1000, // 30 seconds
        enabled: !!rideId,
        ...options,
    });
}

// ---------------------------------------------------------------------------
// useActiveRide – currently in-progress ride
//  • Fetch once on bootstrap
//  • Subsequent updates come from explicit socket-driven refetches
// ---------------------------------------------------------------------------

type UseActiveRideOptions = Omit<
    UseQueryOptions<ActiveRidePayload | null, ApiError>,
    'queryKey' | 'queryFn'
>;

export function useActiveRide(options?: UseActiveRideOptions) {
    return useQuery<ActiveRidePayload | null, ApiError>({
        queryKey: rideKeys.activeRide(),
        queryFn: () => rideService.getActiveRide(),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        ...options,
    });
}

type UseNearbyDriversOptions = Omit<
    UseQueryOptions<NearbyDriver[], ApiError>,
    'queryKey' | 'queryFn'
>;

export function useNearbyDrivers(
    latitude: number | undefined,
    longitude: number | undefined,
    radiusKm: number = 7,
    options?: UseNearbyDriversOptions,
) {
    return useQuery<NearbyDriver[], ApiError>({
        queryKey: rideKeys.nearbyDrivers(latitude, longitude, radiusKm),
        queryFn: () => rideService.getNearbyDrivers(latitude!, longitude!, radiusKm),
        enabled: typeof latitude === 'number' && typeof longitude === 'number',
        staleTime: 8 * 1000,
        refetchInterval: 10 * 1000,
        ...options,
    });
}

// ---------------------------------------------------------------------------
// useRideEstimates – fare estimates for a pickup/dropoff pair
//  • staleTime 5 min (fares don't change that fast)
//  • enabled only when both locations are provided
// ---------------------------------------------------------------------------

type UseRideEstimatesOptions = Omit<
    UseQueryOptions<RideEstimate[], ApiError>,
    'queryKey' | 'queryFn'
>;

export function useRideEstimates(
    payload: RideEstimatePayload | undefined,
    options?: UseRideEstimatesOptions,
) {
    return useQuery<RideEstimate[], ApiError>({
        queryKey: [...rideKeys.estimates(), payload],
        queryFn: () => rideService.getEstimates(payload!),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!payload?.pickup && !!payload?.dropoff,
        ...options,
    });
}

// ---------------------------------------------------------------------------
// useCustomerRides – fetch customer ride history (infinite scroll)
// ---------------------------------------------------------------------------

type UseCustomerRidesOptions = any;
const CUSTOMER_RIDES_LIMIT = 10;

export function useCustomerRides(options?: UseCustomerRidesOptions) {

    return useInfiniteQuery<
        CustomerRidesResponse,
        ApiError,
        InfiniteData<CustomerRidesResponse>,
        readonly string[],
        number
    >({
        queryKey: rideKeys.customerRides(),
        queryFn: ({ pageParam }) => rideService.getCustomerRides(pageParam, CUSTOMER_RIDES_LIMIT),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.data.length < lastPage.limit) return undefined;
            return lastPage.offset + lastPage.limit;
        },
        staleTime: 1 * 60 * 1000, // 1 minute
        ...options,
    });
}

export function useCustomerScheduledRides(options?: UseCustomerRidesOptions) {
    return useInfiniteQuery<
        CustomerRidesResponse,
        ApiError,
        InfiniteData<CustomerRidesResponse>,
        readonly string[],
        number
    >({
        queryKey: rideKeys.customerScheduledRides(),
        queryFn: ({ pageParam }) =>
            rideService.getCustomerScheduledRides(pageParam, CUSTOMER_RIDES_LIMIT),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.data.length < lastPage.limit) return undefined;
            return lastPage.offset + lastPage.limit;
        },
        staleTime: 1 * 60 * 1000, // 1 minute
        ...options,
    });
}

// ---------------------------------------------------------------------------
// useCustomerRideDetail – single customer ride detail
//  • staleTime 30 s (ride data can change when active)
//  • enabled only when rideId is provided
// ---------------------------------------------------------------------------

type UseCustomerRideDetailOptions = Omit<
    UseQueryOptions<CustomerRideDetail, ApiError>,
    'queryKey' | 'queryFn'
>;

export function useCustomerRideDetail(
    rideId: string | undefined,
    options?: UseCustomerRideDetailOptions,
) {
    return useQuery<CustomerRideDetail, ApiError>({
        queryKey: rideKeys.customerRideDetail(rideId!),
        queryFn: () => rideService.getCustomerRideDetail(rideId!),
        staleTime: 30 * 1000,
        enabled: !!rideId,
        ...options,
    });
}

// ---------------------------------------------------------------------------
// useRideTypeFares – available ride types (based on fare endpoint)
//  • staleTime 5 min (slow-changing catalog)
// ---------------------------------------------------------------------------

type UseRideTypeFaresOptions = Omit<
    UseQueryOptions<RideTypeFare[], ApiError>,
    'queryKey' | 'queryFn'
>;

export function useRideTypeFares(
    params: RideTypeFareParams | undefined,
    options?: UseRideTypeFaresOptions,
) {
    return useQuery<RideTypeFare[], ApiError>({
        queryKey: rideKeys.rideTypeFares(params as Record<string, unknown> | undefined),
        queryFn: () => rideService.getRideTypeFares(params!),
        staleTime: 5 * 60 * 1000,
        enabled: !!params,
        ...options,
    });
}

type UseRideTypesOptions = Omit<
    UseQueryOptions<RideTypeCatalogItem[], ApiError>,
    'queryKey' | 'queryFn'
>;

export function useRideTypes(options?: UseRideTypesOptions) {
    return useQuery<RideTypeCatalogItem[], ApiError>({
        queryKey: rideKeys.rideTypeCatalog(),
        queryFn: () => rideService.getRideTypes(),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
}

// ---------------------------------------------------------------------------
// usePrefetchRideDetails – prefetch on user intent (e.g. hover / press-in)
// ---------------------------------------------------------------------------

export function usePrefetchRideDetails() {
    const queryClient = useQueryClient();

    return (rideId: string) => {
        queryClient.prefetchQuery({
            queryKey: rideKeys.detail(rideId),
            queryFn: () => rideService.getRideById(rideId),
            staleTime: 30 * 1000,
        });
    };
}

// ---------------------------------------------------------------------------
// useDriverStats – profile stats for a driver/rider
//  • staleTime 5 min (ratings/reviews don't refresh that often)
//  • enabled only when userId is provided
// ---------------------------------------------------------------------------

type UseDriverStatsOptions = Omit<
    UseQueryOptions<DriverProfileStats, ApiError>,
    'queryKey' | 'queryFn'
>;

export function useDriverStats(
    userId: string | undefined,
    options?: UseDriverStatsOptions,
) {
    return useQuery<DriverProfileStats, ApiError>({
        queryKey: rideKeys.stat(userId!),
        queryFn: () => rideService.getDriverStats(userId!),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!userId,
        ...options,
    });
}

type UseRiderVehicleInfoOptions = Omit<
    UseQueryOptions<RiderVehicleInfo, ApiError>,
    'queryKey' | 'queryFn'
>;

export function useRiderVehicleInfo(
    riderId: string | undefined,
    options?: UseRiderVehicleInfoOptions,
) {
    return useQuery<RiderVehicleInfo, ApiError>({
        queryKey: rideKeys.riderVehicleInfo(riderId!),
        queryFn: () => rideService.getRiderVehicleInfo(riderId!),
        staleTime: 5 * 60 * 1000,
        enabled: !!riderId,
        ...options,
    });
}
