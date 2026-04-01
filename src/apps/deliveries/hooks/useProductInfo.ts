import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { deliveryKeys } from "../api/queryKeys";
import type { ApiError } from "../../../general/api/apiClient";
import type {
  ProductInfoCustomizationsResponse,
  ProductInfoResponse,
} from "../api/productInfoServiceTypes";
import { productInfoService } from "../api/productInfoService";

type UseProductInfoOptions = Omit<
  UseQueryOptions<ProductInfoResponse, ApiError>,
  "queryKey" | "queryFn"
>;
type UseProductInfoCustomizationsOptions = Omit<
  UseQueryOptions<ProductInfoCustomizationsResponse, ApiError>,
  "queryKey" | "queryFn"
>;

export function useProductInfo(
  productId: string,
  options?: UseProductInfoOptions,
) {
  return useQuery<ProductInfoResponse, ApiError>({
    queryKey: deliveryKeys.productInfo(productId),
    queryFn: () => productInfoService.getProductInfo(productId),
    enabled: options?.enabled ?? productId.length > 0,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useProductInfoCustomizations(
  productId: string,
  options?: UseProductInfoCustomizationsOptions,
) {
  return useQuery<ProductInfoCustomizationsResponse, ApiError>({
    queryKey: deliveryKeys.productInfoCustomizations(productId),
    queryFn: () => productInfoService.getProductInfoCustomizations(productId),
    enabled: options?.enabled ?? productId.length > 0,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}
