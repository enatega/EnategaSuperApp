// ---------------------------------------------------------------------------
// Barrel exports for deliveries API layer
// ---------------------------------------------------------------------------

// API client & error
export { default as apiClient, ApiError, tokenManager } from '../../../general/api/apiClient';

// Types
export type {
    ApiResponse,
    DeliveryShopType,
    DeliveryShopTypesApiResponse,
} from './types';

// Query keys (single source of truth)
export { deliveryKeys } from './queryKeys';

// Discovery service
export { discoveryService } from './discoveryService';
