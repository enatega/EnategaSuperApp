import {
    useMutation,
    UseMutationOptions,
    useQueryClient,
} from '@tanstack/react-query';
import { rideKeys } from '../api/queryKeys';
import { rideService } from '../api/rideService';
import type {
    CreateRidePayload,
    RideDetails,
    UpdateRidePayload,
} from '../api/types';
import { ApiError } from '../../../general/api/apiClient';

// ---------------------------------------------------------------------------
// useCreateRide – request a new ride
//  • Invalidates rides list + active ride on success
// ---------------------------------------------------------------------------

type UseCreateRideOptions = Omit<
    UseMutationOptions<RideDetails, ApiError, CreateRidePayload, unknown>,
    'mutationFn'
>;

export function useCreateRide(options?: UseCreateRideOptions) {
    const queryClient = useQueryClient();

    return useMutation<RideDetails, ApiError, CreateRidePayload, unknown>({
        mutationFn: rideService.createRide,
        onSuccess: (data, variables, onMutateResult, ctx) => {
            // Invalidate lists so new ride appears
            queryClient.invalidateQueries({ queryKey: rideKeys.lists() });
            queryClient.invalidateQueries({ queryKey: rideKeys.customerRides() });
            // Invalidate active ride – this is now the active one
            queryClient.invalidateQueries({ queryKey: rideKeys.activeRide() });

            options?.onSuccess?.(data, variables, onMutateResult, ctx);
        },
        onError: options?.onError,
        onSettled: options?.onSettled,
    });
}

// ---------------------------------------------------------------------------
// useUpdateRide – change status, add rating, etc.
//  • Optimistic update on the detail cache
//  • Invalidates related caches on settle
// ---------------------------------------------------------------------------

interface UpdateRideContext {
    previousRide?: RideDetails;
}

type UseUpdateRideOptions = Omit<
    UseMutationOptions<RideDetails, ApiError, UpdateRidePayload, UpdateRideContext>,
    'mutationFn'
>;

export function useUpdateRide(options?: UseUpdateRideOptions) {
    const queryClient = useQueryClient();

    return useMutation<
        RideDetails,
        ApiError,
        UpdateRidePayload,
        UpdateRideContext
    >({
        mutationFn: rideService.updateRide,
        // ── Optimistic update ────────────────────────────────────────────
        onMutate: async (variables) => {
            // Cancel in-flight refetches to prevent overwriting optimistic data
            await queryClient.cancelQueries({
                queryKey: rideKeys.detail(variables.rideId),
            });

            const previousRide = queryClient.getQueryData<RideDetails>(
                rideKeys.detail(variables.rideId),
            );

            // Optimistically set new values
            if (previousRide) {
                queryClient.setQueryData<RideDetails>(
                    rideKeys.detail(variables.rideId),
                    {
                        ...previousRide,
                        ...variables,
                    },
                );
            }

            return { previousRide };
        },
        // ── Rollback on error ────────────────────────────────────────────
        onError: (error, variables, onMutateResult, ctx) => {
            if (onMutateResult?.previousRide) {
                queryClient.setQueryData(
                    rideKeys.detail(variables.rideId),
                    onMutateResult.previousRide,
                );
            }
            options?.onError?.(error, variables, onMutateResult, ctx);
        },
        // ── Ensure cache is consistent on settle ─────────────────────────
        onSettled: (data, error, variables, onMutateResult, ctx) => {
            queryClient.invalidateQueries({
                queryKey: rideKeys.detail(variables.rideId),
            });
            queryClient.invalidateQueries({ queryKey: rideKeys.lists() });
            queryClient.invalidateQueries({ queryKey: rideKeys.customerRides() });
            queryClient.invalidateQueries({ queryKey: rideKeys.activeRide() });

            options?.onSettled?.(data, error, variables, onMutateResult, ctx);
        },
    });
}

// ---------------------------------------------------------------------------
// useCancelRide
// ---------------------------------------------------------------------------

type UseCancelRideOptions = Omit<
    UseMutationOptions<void, ApiError, string, unknown>,
    'mutationFn'
>;

export function useCancelRide(options?: UseCancelRideOptions) {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string, unknown>({
        mutationFn: rideService.cancelRide,
        onSuccess: (data, rideId, onMutateResult, ctx) => {
            queryClient.invalidateQueries({ queryKey: rideKeys.detail(rideId) });
            queryClient.invalidateQueries({ queryKey: rideKeys.lists() });
            queryClient.invalidateQueries({ queryKey: rideKeys.customerRides() });
            queryClient.invalidateQueries({ queryKey: rideKeys.activeRide() });

            options?.onSuccess?.(data, rideId, onMutateResult, ctx);
        },
        onError: options?.onError,
        onSettled: options?.onSettled,
    });
}

type UseCancelRideRequestOptions = Omit<
    UseMutationOptions<void, ApiError, string, unknown>,
    'mutationFn'
>;

export function useCancelRideRequest(options?: UseCancelRideRequestOptions) {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string, unknown>({
        mutationFn: rideService.cancelRideRequest,
        onSuccess: (data, rideId, onMutateResult, ctx) => {
            queryClient.invalidateQueries({ queryKey: rideKeys.detail(rideId) });
            queryClient.invalidateQueries({ queryKey: rideKeys.lists() });
            queryClient.invalidateQueries({ queryKey: rideKeys.customerRides() });
            queryClient.invalidateQueries({ queryKey: rideKeys.activeRide() });

            options?.onSuccess?.(data, rideId, onMutateResult, ctx);
        },
        onError: options?.onError,
        onSettled: options?.onSettled,
    });
}

// ---------------------------------------------------------------------------
// useRateRide
// ---------------------------------------------------------------------------

interface RateRideVariables {
    rideId: string;
    rating: number;
    feedback?: string;
}

type UseRateRideOptions = Omit<
    UseMutationOptions<void, ApiError, RateRideVariables, unknown>,
    'mutationFn'
>;

export function useRateRide(options?: UseRateRideOptions) {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, RateRideVariables, unknown>({
        mutationFn: ({ rideId, rating, feedback }) =>
            rideService.rateRide(rideId, rating, feedback),
        onSuccess: (data, variables, onMutateResult, ctx) => {
            queryClient.invalidateQueries({
                queryKey: rideKeys.detail(variables.rideId),
            });
            queryClient.invalidateQueries({ queryKey: rideKeys.lists() });
            queryClient.invalidateQueries({ queryKey: rideKeys.customerRides() });

            options?.onSuccess?.(data, variables, onMutateResult, ctx);
        },
        onError: options?.onError,
        onSettled: options?.onSettled,
    });
}
