import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../../../../general/api/apiClient';
import { deliveryKeys, favouriteKeys } from '../../api/queryKeys';
import {
    favouritesService,
    type ToggleFavouriteParams,
    type ToggleFavouriteResponse,
} from '../api/favouritesService';

type Options = {
    storeId?: string;
    onSuccess?: (data: ToggleFavouriteResponse) => void;
    onError?: (error: ApiError) => void;
};

export function useToggleFavouriteMutation(options?: Options) {
    const queryClient = useQueryClient();

    return useMutation<ToggleFavouriteResponse, ApiError, ToggleFavouriteParams>({
        mutationFn: favouritesService.toggleFavourite,
        onSuccess: (data) => {
            // Invalidate favourites list screen
            queryClient.invalidateQueries({ queryKey: favouriteKeys.list() });

            // Refetch the storeView so isFavorited is up-to-date on next render
            if (options?.storeId) {
                queryClient.invalidateQueries({
                    queryKey: deliveryKeys.storeView(options.storeId),
                });
            }

            options?.onSuccess?.(data);
        },
        onError: (error) => {
            options?.onError?.(error);
        },
    });
}
