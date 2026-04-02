import type {
  SearchProductItem,
  SearchStoreItem,
} from "../../../api/searchServiceTypes";

export interface ProductMiniCardScrollerProps {
  products: SearchProductItem[];
  onSeeAllPress?: () => void;
  onProductPress?: (product: SearchProductItem) => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export interface StoreCardScrollerProps {
  stores: SearchStoreItem[];
  onSeeAllPress?: () => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export interface SearchResultsProps {
  isSearchActive: boolean;
  shouldSearchStores: boolean;
  isSearchLoading: boolean;
  hasNoResults: boolean;
  products: SearchProductItem[];
  stores: SearchStoreItem[];
  isFetchingMoreProducts?: boolean;
  isFetchingMoreStores?: boolean;
  onLoadMoreProducts?: () => void;
  onLoadMoreStores?: () => void;
}
