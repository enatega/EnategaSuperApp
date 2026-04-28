// ---------------------------------------------------------------------------
// Barrel exports for rideSharing hooks
// ---------------------------------------------------------------------------

// Ride Queries
export {
    useRides,
    useRideDetails,
    useActiveRide,
    useRideEstimates,
    usePrefetchRideDetails,
    useDriverStats,
    useRiderVehicleInfo,
} from './useRideQueries';
export { useInitializeRideSharingConfig } from './useInitializeRideSharingConfig';

// Ride Mutations
export {
    useCreateRide,
    useUpdateRide,
    useCancelRide,
    useRateRide,
} from './useRideMutations';

// User Queries
export { useUser, useWalletBalance, useTodayNotifications, usePastNotifications } from './useUserQueries';

// User Mutations
export { useUpdateUser, useUpdateProfileImage, useUpdatePassword } from './useUserMutations';


// Profile & Sidebar
export { useProfile } from './useProfile';
export { useSidebarMenu } from './useSidebarMenu';
export type { ProfileStackParamList } from './useSidebarMenu';
