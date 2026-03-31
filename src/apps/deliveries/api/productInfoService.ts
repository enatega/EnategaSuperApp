import apiClient from "../../../general/api/apiClient";
import type {
  ProductInfoCustomizationsResponse,
  ProductInfoResponse,
} from "./productInfoServiceTypes";

const BASE_URL = "/api/v1/apps/deliveries/products/mobile";

export const productInfoService = {
  getProductInfo: (productId: string): Promise<ProductInfoResponse> =>
    apiClient.get<ProductInfoResponse>(`${BASE_URL}/${productId}`),

  getProductInfoCustomizations: (
    productId: string,
  ): Promise<ProductInfoCustomizationsResponse> =>
    apiClient.get<ProductInfoCustomizationsResponse>(
      `${BASE_URL}/${productId}/customizations`,
    ),
};
