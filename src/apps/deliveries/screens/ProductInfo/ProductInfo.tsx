import React, { useCallback } from "react";
import MainContainer from "../../components/productInfo/MainContainer";
import ProductInfoErrorState from "../../components/productInfo/ProductInfoErrorState";
import ProductInfoLoadingSkeleton from "../../components/productInfo/ProductInfoLoadingSkeleton";
import {
  useProductInfo,
  useProductInfoCustomizations,
} from "../../hooks/useProductInfo";

type ProductInfoProps = {
  route?: {
    params?: {
      productId?: string;
    };
  };
};

const ProductInfo = ({ route }: ProductInfoProps) => {
  const productId = route?.params?.productId ?? "";
  const {
    data: productInfo,
    error: productInfoError,
    isLoading: isProductInfoLoading,
    isFetching: isProductInfoFetching,
    refetch: refetchProductInfo,
  } = useProductInfo(productId);
  const {
    data: customizations,
    isLoading: isCustomizationsLoading,
    isFetching: isCustomizationsFetching,
    refetch: refetchCustomizations,
  } = useProductInfoCustomizations(productId, {
    enabled: Boolean(productInfo?.productId),
  });
  const handleRefresh = useCallback(async () => {
    const productInfoResult = await refetchProductInfo();
    const latestProductId =
      productInfoResult.data?.productId ?? productInfo?.productId;

    if (latestProductId) {
      await refetchCustomizations();
    }
  }, [productInfo?.productId, refetchCustomizations, refetchProductInfo]);
  const isRefreshing = isProductInfoFetching || isCustomizationsFetching;

  if (isProductInfoLoading && !productInfo) {
    return <ProductInfoLoadingSkeleton />;
  }

  if (!productInfo) {
    return (
      <ProductInfoErrorState
        isRetrying={isRefreshing}
        onRetry={() => {
          void handleRefresh();
        }}
      />
    );
  }

  return (
    <MainContainer
      customizations={customizations}
      data={productInfo}
      isCustomizationsLoading={isCustomizationsLoading}
      isRefreshing={isRefreshing}
      onRefresh={handleRefresh}
    />
  );
};

export default ProductInfo;
