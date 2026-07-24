import { create } from "zustand";
import type {
  AppointmentBookingReviewResponse,
  AppointmentBookingSelection,
  AppointmentBookingWorkerMode,
  AppointmentCartResponse,
  AppointmentPublicTeamMember,
  AppointmentStoreService,
} from "../api/types";

export type AppointmentCartReviewDraft = {
  review: AppointmentBookingReviewResponse;
  scheduledAt: string;
  selections: AppointmentBookingSelection[];
  storeId: string;
  title: string;
  team: AppointmentPublicTeamMember[];
  selectedServices?: AppointmentStoreService[];
  workerMode: AppointmentBookingWorkerMode;
  workerId?: string;
};

type AppointmentCartState = {
  hasLocalDraft: boolean;
  items: AppointmentStoreService[];
  reviewDraft: AppointmentCartReviewDraft | null;
  selections: AppointmentBookingSelection[];
  storeId: string | null;
  storeTitle: string | null;
  clearCart: () => void;
  clearReviewDraft: () => void;
  hydrateCart: (cart: AppointmentCartResponse) => void;
  hasService: (serviceId: string) => boolean;
  removeService: (serviceId: string) => void;
  replaceItems: (items: AppointmentStoreService[]) => void;
  setServiceSelection: (
    selection: AppointmentBookingSelection,
    servicePatch?: Partial<AppointmentStoreService>,
  ) => void;
  setReviewDraft: (draft: AppointmentCartReviewDraft) => void;
  setStoreContext: (params: { storeId: string; title?: string | null }) => void;
  toggleService: (service: AppointmentStoreService) => void;
};

export const useAppointmentCartStore = create<AppointmentCartState>(
  (set, get) => ({
    hasLocalDraft: false,
    items: [],
    reviewDraft: null,
    selections: [],
    storeId: null,
    storeTitle: null,
    clearCart: () =>
      set({
        items: [],
        hasLocalDraft: false,
        reviewDraft: null,
        selections: [],
        storeId: null,
        storeTitle: null,
      }),
    clearReviewDraft: () =>
      set((state) => ({
        ...state,
        reviewDraft: null,
      })),
    hydrateCart: (cart) =>
      set((state) => ({
        hasLocalDraft: false,
        items: cart.items.map((item) => ({
          id: item.productId,
          name: item.name,
          shortDescription: item.description,
          description: item.description,
          estimatedDurationMinutes: item.estimatedDurationMinutes,
          price: item.unitPrice,
          originalPrice: item.originalUnitPrice,
          discountedPrice: item.deal ? item.unitPrice : null,
          deal: item.deal,
          imageUrl: item.imageUrl,
        })),
        reviewDraft: null,
        selections: cart.items.map((item) => ({
          serviceId: item.productId,
          selectedOptions: item.selectedOptions.map((option) => ({
            groupId: option.groupId,
            optionId: option.optionId,
          })),
        })),
        storeId: cart.storeId,
        storeTitle: state.storeId === cart.storeId ? state.storeTitle : null,
      })),
    hasService: (serviceId: string) =>
      get().items.some((item) => item.id === serviceId),
    removeService: (serviceId: string) =>
      set((state) => {
        const nextItems = state.items.filter((item) => item.id !== serviceId);

        if (nextItems.length === 0) {
          return {
            items: [],
            hasLocalDraft: false,
            reviewDraft: null,
            selections: [],
            storeId: null,
            storeTitle: null,
          };
        }

        return {
          ...state,
          items: nextItems,
          hasLocalDraft: true,
          reviewDraft: null,
          selections: state.selections.filter(
            (selection) => selection.serviceId !== serviceId,
          ),
        };
      }),
    replaceItems: (items) =>
      set((state) => ({
        ...state,
        items,
        hasLocalDraft: false,
        reviewDraft: null,
      })),
    setServiceSelection: (selection, servicePatch) =>
      set((state) => ({
        ...state,
        hasLocalDraft: true,
        items: state.items.map((item) =>
          item.id === selection.serviceId
            ? { ...item, ...(servicePatch ?? {}) }
            : item,
        ),
        reviewDraft: null,
        selections: [
          ...state.selections.filter(
            (item) => item.serviceId !== selection.serviceId,
          ),
          selection,
        ],
      })),
    setReviewDraft: (draft) =>
      set((state) => ({
        ...state,
        reviewDraft: draft,
      })),
    setStoreContext: ({ storeId, title }) =>
      set((state) => {
        if (state.storeId === storeId) {
          return {
            ...state,
            storeTitle: title ?? state.storeTitle,
          };
        }

        return {
          items: [],
          hasLocalDraft: false,
          reviewDraft: null,
          selections: [],
          storeId,
          storeTitle: title ?? null,
        };
      }),
    toggleService: (service) =>
      set((state) => {
        const exists = state.items.some((item) => item.id === service.id);

        return {
          ...state,
          hasLocalDraft: true,
          items: exists
            ? state.items.filter((item) => item.id !== service.id)
            : [...state.items, service],
          reviewDraft: null,
          selections: exists
            ? state.selections.filter(
                (selection) => selection.serviceId !== service.id,
              )
            : state.selections,
        };
      }),
  }),
);
