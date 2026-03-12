// ---------------------------------------------------------------------------
// Query Key Factory  (qk-factory-pattern + qk-hierarchical-organization)
//
// ALL deliveries query keys live here.
// This is the single source of truth — do not create separate key files.
// Hierarchy: entity → scope → id / filters
// ---------------------------------------------------------------------------

export const deliveryKeys = {
    /** Root key – invalidating this clears ALL deliveries-related caches. */
    all: ['deliveries'] as const,

    // Discovery
    discovery: () => [...deliveryKeys.all, 'discovery'] as const,
    shopTypes: () => [...deliveryKeys.discovery(), 'shop-types'] as const,

    // Addresses
    addresses: () => [...deliveryKeys.all, 'addresses'] as const,
    address: (id: string) => [...deliveryKeys.addresses(), id] as const,
};

/*
  Usage cheat-sheet:
  ──────────────────
  deliveryKeys.all         → ['deliveries']
  deliveryKeys.discovery() → ['deliveries', 'discovery']
  deliveryKeys.shopTypes() → ['deliveries', 'discovery', 'shop-types']

  Invalidation examples:
  ──────────────────────
  queryClient.invalidateQueries({ queryKey: deliveryKeys.all })         // all deliveries
  queryClient.invalidateQueries({ queryKey: deliveryKeys.discovery() }) // discovery endpoints
  queryClient.invalidateQueries({ queryKey: deliveryKeys.shopTypes() }) // shop types
*/
