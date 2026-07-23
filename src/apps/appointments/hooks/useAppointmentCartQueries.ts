import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { ApiError } from "../../../general/api/apiClient";
import { appointmentCartService } from "../api/appointmentCartService";
import { appointmentKeys } from "../api/queryKeys";
import type {
  AppointmentCartCountResponse,
  AppointmentCartResponse,
  AppointmentCartSyncRequest,
} from "../api/types";

type CartQueryOptions = Omit<
  UseQueryOptions<AppointmentCartResponse, ApiError>,
  "queryKey" | "queryFn"
>;

function syncAppointmentCartQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  cart: AppointmentCartResponse,
) {
  queryClient.setQueryData(appointmentKeys.cart(), cart);
  queryClient.setQueryData<AppointmentCartCountResponse>(
    appointmentKeys.cartCount(),
    {
      bucketId: cart.bucketId,
      totalItems: cart.totalItems,
      uniqueItems: cart.uniqueItems,
      isEmpty: cart.isEmpty,
    },
  );
}

export function useAppointmentCartQuery(options?: CartQueryOptions) {
  return useQuery<AppointmentCartResponse, ApiError>({
    queryKey: appointmentKeys.cart(),
    queryFn: appointmentCartService.getCart,
    staleTime: 30_000,
    ...options,
  });
}

export function useAppointmentCartCountQuery() {
  return useQuery<AppointmentCartCountResponse, ApiError>({
    queryKey: appointmentKeys.cartCount(),
    queryFn: appointmentCartService.getCartCount,
    staleTime: 30_000,
  });
}

export function useSyncAppointmentCartMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    AppointmentCartResponse,
    ApiError,
    AppointmentCartSyncRequest
  >({
    mutationFn: appointmentCartService.syncCart,
    onSuccess: (cart) => syncAppointmentCartQueries(queryClient, cart),
    retry: false,
  });
}

export function useRemoveAppointmentCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<AppointmentCartResponse, ApiError, string>({
    mutationFn: appointmentCartService.removeItem,
    onSuccess: (cart) => syncAppointmentCartQueries(queryClient, cart),
    retry: false,
  });
}

export function useClearAppointmentCartMutation() {
  const queryClient = useQueryClient();

  return useMutation<AppointmentCartResponse, ApiError, void>({
    mutationFn: appointmentCartService.clearCart,
    onSuccess: (cart) => syncAppointmentCartQueries(queryClient, cart),
    retry: false,
  });
}
