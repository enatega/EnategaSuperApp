export type CartSelectionInput = {
  groupId: string;
  optionId: string;
};

export type AddCartItemInput = {
  productId: string;
  quantity?: number;
  selectedOptions?: CartSelectionInput[];
};

export type UpdateCartItemQuantityInput = {
  quantity: number;
};

export type CartSelectedOption = {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  quantity: number;
  basePrice: number;
  unitPrice: number;
  lineTotal: number;
  selectedOptions: CartSelectedOption[];
  storeId: string;
  inStock: boolean;
};

export type CartResponse = {
  bucketId: string | null;
  customerId: string;
  status: string;
  storeId: string | null;
  totalItems: number;
  uniqueItems: number;
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  isEmpty: boolean;
  items: CartItem[];
  message?: string[];
};

export type CartCountResponse = {
  bucketId: string | null;
  totalItems: number;
  uniqueItems: number;
  isEmpty: boolean;
};
