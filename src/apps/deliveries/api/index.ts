// ---------------------------------------------------------------------------
// Barrel exports for deliveries API layer
// ---------------------------------------------------------------------------

// API client & error
export { default as apiClient, ApiError, tokenManager } from '../../../general/api/apiClient';

// Types
export type {
    ApiResponse,
    DeliveryNearbyStore,
    DeliveryNearbyStoresApiResponse,
    DeliveryOrderAgainApiResponse,
    DeliveryOrderAgainItem,
    DeliveryShopTypeProduct,
    DeliveryShopTypeProductsApiResponse,
    DeliveryShopType,
    DeliveryShopTypesApiResponse,
} from './types';

// Query keys (single source of truth)
export { deliveryKeys } from './queryKeys';

// Discovery service
export { discoveryService } from './discoveryService';

// Chat service
export { chatService } from './chatService';
export type {
    DeliveryChatMessageRecord,
    DeliveryChatBoxesResponse,
    DeliveryChatBoxRecord,
    DeliveryChatMessagesResponse,
    SendDeliveryChatMessagePayload,
    SendDeliveryChatMessageResponse,
} from './chatServiceTypes';
