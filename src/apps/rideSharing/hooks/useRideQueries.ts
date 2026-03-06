import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { rideKeys } from '../api/queryKeys';
import { rideService } from '../api/rideService';
import type {
    PaginatedResponse,
    Ride,
    RideDetails,
    RideEstimate,
    RideEstimatePayload,
    RideFilters,
    RideTypeFare,
    RideTypeFareParams,
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
//  • Polls every 10 s when data exists (driver location, ETA updates)
// ---------------------------------------------------------------------------

type UseActiveRideOptions = Omit<
    UseQueryOptions<RideDetails | null, ApiError>,
    'queryKey' | 'queryFn'
>;

export function useActiveRide(options?: UseActiveRideOptions) {
    return useQuery<RideDetails | null, ApiError>({
        queryKey: rideKeys.activeRide(),
        queryFn: () => rideService.getActiveRide(),
        staleTime: 10 * 1000, // 10 seconds
        refetchInterval: (query) => (query.state.data ? 10_000 : false), // poll only when ride exists
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
