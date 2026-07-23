import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../../../general/api/apiClient';
import { appointmentFavouriteKeys, appointmentKeys } from '../api/queryKeys';
import {
  appointmentFavouritesService,
  type ToggleAppointmentFavouriteParams,
  type ToggleAppointmentFavouriteResponse,
} from '../api/favouritesService';

type Options = {
  storeId?: string;
  onSuccess?: (
    data: ToggleAppointmentFavouriteResponse,
    variables: ToggleAppointmentFavouriteParams,
  ) => void;
  onError?: (error: ApiError) => void;
};

export function useToggleFavouriteMutation(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation<
    ToggleAppointmentFavouriteResponse,
    ApiError,
    ToggleAppointmentFavouriteParams
  >({
    mutationFn: appointmentFavouritesService.toggleFavourite,
    retry: false,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: appointmentFavouriteKeys.list(),
      });
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.discovery(),
      });

      if (options?.storeId) {
        queryClient.invalidateQueries({
          queryKey: appointmentKeys.storeView(options.storeId),
        });
      }

      options?.onSuccess?.(data, variables);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
