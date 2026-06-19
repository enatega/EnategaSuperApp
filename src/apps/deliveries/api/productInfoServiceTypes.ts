// ---------------------------------------------------------------------------
// Product info Types
// ---------------------------------------------------------------------------

export interface ProductInfoCategory {
  id: string;
  name: string;
}

export interface ProductInfoCustomizationOption {
  optionId: string;
  title: string;
  description: string | null;
  price: number;
  imageUrl?: string | null;
}

export interface ProductInfoCustomizationSection {
  groupId: string;
  name: string;
  description: string | null;
  type: string;
  dependsOnVariationId?: string | null;
  price?: number;
  minSelect: number;
  maxSelect: number;
  required: boolean;
  selectionType: "single" | "multiple" | string;
  helperText: string | null;
  options: ProductInfoCustomizationOption[];
}

export interface ProductInfoNutritionEntry {
  id: string;
  label: string;
  value: string;
}

export interface ProductInfoResponse {
  productId: string;
  storeId: string;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  averageRating: number;
  reviewCount: number;
  inStock: boolean;
  category: ProductInfoCategory | null;
  subcategory: ProductInfoCategory | null;
  ingredients?: string | null;
  usage?: string | null;
  amountPer?: string | null;
  nutrition?: ProductInfoNutritionEntry[] | null;
  deal?:
    | string
    | {
        id?: string;
        deal_name?: string;
        discount_type?: string;
        discount_value?: number;
        discounted_price?: number;
        start_date?: string;
        end_date?: string;
      }
    | null;
  dealType?: string | null;
  dealAmount?: number | null;
}

export interface ProductInfoCustomizationsResponse {
  variations: ProductInfoCustomizationSection[];
  addons: ProductInfoCustomizationSection[];
}
