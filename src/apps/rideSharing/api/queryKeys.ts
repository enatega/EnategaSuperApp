import type { RideFilters } from './types';

// ---------------------------------------------------------------------------
// Query Key Factory  (qk-factory-pattern + qk-hierarchical-organization)
//
// ALL query keys (rides + user + any future domain) live here.
// This is the single source of truth — do not create separate key files.
// Hierarchy: entity → scope → id / filters
// ---------------------------------------------------------------------------

// ── Rides ────────────────────────────────────────────────────────────────────

export const rideKeys = {
  /** Root key – invalidating this clears ALL ride-related caches. */
  all: ['rides'] as const,

  // Lists
  lists: () => [...rideKeys.all, 'list'] as const,
  list: (filters?: RideFilters) => [...rideKeys.lists(), filters] as const,

  // Details
  details: () => [...rideKeys.all, 'detail'] as const,
  detail: (id: string) => [...rideKeys.details(), id] as const,

  // Sub-resources
  estimates: () => [...rideKeys.all, 'estimates'] as const,
  activeRide: () => [...rideKeys.all, 'active'] as const,
  rideTypes: () => [...rideKeys.all, 'types'] as const,
  rideTypeCatalog: () => [...rideKeys.rideTypes(), 'catalog'] as const,
  rideTypeFares: (params?: Record<string, unknown>) =>
      [...rideKeys.rideTypes(), params] as const,
  places: () => [...rideKeys.all, 'places'] as const,
  placeSuggestions: (input: string) => [...rideKeys.places(), 'suggestions', input] as const,
  placeDetails: (placeId: string) => [...rideKeys.places(), 'details', placeId] as const,
  route: (fromPlaceId: string, toPlaceId: string) => [...rideKeys.all, 'route', fromPlaceId, toPlaceId] as const,
  nearbyDrivers: (latitude?: number, longitude?: number, radiusKm?: number) =>
      [...rideKeys.all, 'nearby-drivers', latitude ?? 'unknown', longitude ?? 'unknown', radiusKm ?? 'default'] as const,

  // Profile / Stats
  stats: () => [...rideKeys.all, 'stats'] as const,
  stat: (userId: string) => [...rideKeys.stats(), userId] as const,

  // Customer Rides
  customerRides: () => [...rideKeys.all, 'customer'] as const,
  customerRideList: (offset: number) => [...rideKeys.customerRides(), offset] as const,
  customerRideDetail: (rideId: string) => [...rideKeys.customerRides(), 'detail', rideId] as const,
};

// ── User ─────────────────────────────────────────────────────────────────────

export const userKeys = {
  /** Root key – invalidating this clears ALL user-related caches. */
  all: ['user'] as const,

  /** Current authenticated user profile. */
  profile: () => [...userKeys.all, 'profile'] as const,

};

/*
  Usage cheat-sheet:
  ──────────────────
  rideKeys.all                          → ['rides']
  rideKeys.lists()                      → ['rides', 'list']
  rideKeys.list({ status: 'pending' })  → ['rides', 'list', { status: 'pending' }]
  rideKeys.details()                    → ['rides', 'detail']
  rideKeys.detail('abc-123')            → ['rides', 'detail', 'abc-123']
  rideKeys.estimates()                  → ['rides', 'estimates']
  rideKeys.activeRide()                 → ['rides', 'active']
  rideKeys.stat('user-id')             → ['rides', 'stats', 'user-id']

  userKeys.all                          → ['user']
  userKeys.profile()                    → ['user', 'profile']

  Invalidation examples:
  ──────────────────────
  queryClient.invalidateQueries({ queryKey: rideKeys.all })            // all rides
  queryClient.invalidateQueries({ queryKey: rideKeys.lists() })        // all ride lists
  queryClient.invalidateQueries({ queryKey: rideKeys.detail('123') })  // single ride
  queryClient.invalidateQueries({ queryKey: userKeys.profile() })      // user profile
*/
