import { useMutation } from '@tanstack/react-query';
import { ApiError } from '../api/apiClient';
import {
  deleteAccountService,
  type DeleteAccountResponse,
} from '../api/settingsService';

export function useDeleteAccountMutation() {
  return useMutation<DeleteAccountResponse, ApiError, string>({
    mutationFn: (reason: string) => deleteAccountService.deleteAccount(reason),
  });
}
