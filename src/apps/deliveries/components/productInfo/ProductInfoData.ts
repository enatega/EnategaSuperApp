export type ProductOption = {
  id: string;
  label: string;
  price: number;
  description?: string;
};

export type NutritionItem = {
  id: string;
  label: string;
  value: string;
};

export type ProductOptionSection = {
  title: string;
  helperText?: string;
};

export type ProductInfoData = {
  imageUri: string;
  name: string;
  basePrice: number;
  description: string;
  ingredients?: string;
  usage?: string;
  amountPer?: string;
  nutrition: NutritionItem[];
  nutritionSection?: ProductOptionSection;
  sizes: ProductOption[];
  sizesSection?: ProductOptionSection;
  flavours: ProductOption[];
  flavoursSection?: ProductOptionSection;
};