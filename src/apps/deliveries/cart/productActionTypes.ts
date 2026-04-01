import type { CartProductReference } from './cartProductTypes';

export type DeliveryProductActionTarget = CartProductReference & {
  storeName?: string | null;
};

export type DeliveryProductActionBinding = {
  target: DeliveryProductActionTarget;
  onOpenProduct?: (target: DeliveryProductActionTarget) => void;
  onRequestCartAction?: (target: DeliveryProductActionTarget) => void;
};
