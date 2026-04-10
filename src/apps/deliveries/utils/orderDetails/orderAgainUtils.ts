import type { QueryClient } from "@tanstack/react-query";
import type { CartSelectionInput } from "../../api/cartServiceTypes";
import { deliveryKeys } from "../../api/queryKeys";
import type {
  ProductInfoCustomizationOption,
  ProductInfoCustomizationSection,
  ProductInfoCustomizationsResponse,
} from "../../api/productInfoServiceTypes";
import { productInfoService } from "../../api/productInfoService";
import type {
  DeliveryOrderProduct,
  DeliveryOrderProductAddon,
  OrderDetailsResponse,
} from "../../api/ordersServiceTypes";

type OrderAgainCartItemInput = {
  productId: string;
  quantity: number;
  selectedOptions?: CartSelectionInput[];
};

function normalizeText(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function isOrderProductAddon(value: unknown): value is DeliveryOrderProductAddon {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getCustomizationSections(customizations: ProductInfoCustomizationsResponse) {
  return [...customizations.variations, ...customizations.addons];
}

function findMatchingSection(
  sections: ProductInfoCustomizationSection[],
  groupName: string | null | undefined,
) {
  const normalizedGroupName = normalizeText(groupName);

  return sections.find((section) => normalizeText(section.name) === normalizedGroupName);
}

function findMatchingOption(
  section: ProductInfoCustomizationSection,
  optionName: string | null | undefined,
) {
  const normalizedOptionName = normalizeText(optionName);

  return section.options.find((option) => normalizeText(option.title) === normalizedOptionName);
}

function mapOrderProductSelections(
  product: DeliveryOrderProduct,
  customizations: ProductInfoCustomizationsResponse,
): CartSelectionInput[] | undefined {
  const selectedOptions = (product.selectedOptions ?? []).filter(isOrderProductAddon);

  if (selectedOptions.length === 0) {
    return undefined;
  }

  const sections = getCustomizationSections(customizations);
  const mappedSelections = selectedOptions.map((selectedOption) => {
    const section = findMatchingSection(sections, selectedOption.groupName);

    if (!section) {
      throw new Error("Unable to match one or more saved selections.");
    }

    if (section.options.length === 0) {
      return {
        groupId: section.groupId,
        optionId: section.groupId,
      };
    }

    const option = findMatchingOption(section, selectedOption.optionName);

    if (!option) {
      throw new Error("Unable to match one or more saved selections.");
    }

    return {
      groupId: section.groupId,
      optionId: option.optionId,
    };
  });

  return mappedSelections.length > 0 ? mappedSelections : undefined;
}

async function getProductCustomizations(
  queryClient: QueryClient,
  productId: string,
) {
  return queryClient.fetchQuery({
    queryKey: deliveryKeys.productInfoCustomizations(productId),
    queryFn: () => productInfoService.getProductInfoCustomizations(productId),
    staleTime: 10 * 60 * 1000,
  });
}

async function buildOrderAgainCartItemInput(
  queryClient: QueryClient,
  product: DeliveryOrderProduct,
): Promise<OrderAgainCartItemInput> {
  const productId = product.productId?.trim();

  if (!productId) {
    throw new Error("A reordered item is missing its product reference.");
  }

  const quantity = typeof product.quantity === "number" && product.quantity > 0
    ? product.quantity
    : 1;
  const selectedOptions = (product.selectedOptions ?? []).filter(isOrderProductAddon);

  if (selectedOptions.length === 0) {
    return {
      productId,
      quantity,
    };
  }

  const customizations = await getProductCustomizations(queryClient, productId);

  return {
    productId,
    quantity,
    selectedOptions: mapOrderProductSelections(product, customizations),
  };
}

export async function buildOrderAgainCartInputs(
  queryClient: QueryClient,
  order: OrderDetailsResponse,
) {
  const products = order.orderItems.products ?? [];

  if (products.length === 0) {
    throw new Error("This order does not contain any items to reorder.");
  }

  return Promise.all(
    products.map((product) => buildOrderAgainCartItemInput(queryClient, product)),
  );
}
