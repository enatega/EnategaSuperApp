import { useMutation } from '@tanstack/react-query';
import { deleteAccountService } from '../api/deleteAccountService';
import { ApiError } from '../../../general/api/apiClient';
import type { DeleteAccountResponse } from '../api/deleteAccountService';

export function useDeleteAccountMutation() {
  return useMutation<DeleteAccountResponse, ApiError, string>({
    mutationFn: (reason: string) => deleteAccountService.deleteAccount(reason),
  });
}
