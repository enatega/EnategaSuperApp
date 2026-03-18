import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../../../../general/api/apiClient';
import { favouriteKeys } from '../../api/queryKeys';
import {
    favouritesService,
    type ToggleFavouriteParams,
    type ToggleFavouriteResponse,
} from '../api/favouritesService';

type Options = {
    onSuccess?: (data: ToggleFavouriteResponse) => void;
    onError?: (error: ApiError) => void;
};

export function useToggleFavouriteMutation(options?: Options) {
    const queryClient = useQueryClient();

    return useMutation<ToggleFavouriteResponse, ApiError, ToggleFavouriteParams>({
        mutationFn: favouritesService.toggleFavourite,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: favouriteKeys.list() });
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            options?.onError?.(error);
        },
    });
}
