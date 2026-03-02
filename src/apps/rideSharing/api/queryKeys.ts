import type { RideFilters } from './types';

// ---------------------------------------------------------------------------
// Query Key Factory  (qk-factory-pattern + qk-hierarchical-organization)
//
// All query keys live here → single source of truth.
// Hierarchy: entity → scope → id / filters
// ---------------------------------------------------------------------------

export const rideKeys = {
    /** Root key – invalidating this clears ALL ride-related caches. */
    all: ['rides'] as const,

    // ── Lists ───────────────────────────────────────────────────────────
    lists: () => [...rideKeys.all, 'list'] as const,
    list: (filters?: RideFilters) => [...rideKeys.lists(), filters] as const,

    // ── Details ─────────────────────────────────────────────────────────
    details: () => [...rideKeys.all, 'detail'] as const,
    detail: (id: string) => [...rideKeys.details(), id] as const,

    // ── Sub-resources ───────────────────────────────────────────────────
    estimates: () => [...rideKeys.all, 'estimates'] as const,
    activeRide: () => [...rideKeys.all, 'active'] as const,
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

  Invalidation examples:
  ──────────────────────
  queryClient.invalidateQueries({ queryKey: rideKeys.all })            // everything
  queryClient.invalidateQueries({ queryKey: rideKeys.lists() })        // all lists
  queryClient.invalidateQueries({ queryKey: rideKeys.detail('123') })  // single ride
*/
