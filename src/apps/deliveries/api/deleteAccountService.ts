import apiClient from '../../../general/api/apiClient';

export type DeleteAccountResponse = {
  message: string;
};

export const deleteAccountService = {
  deleteAccount: (message: string) =>
    apiClient.patch<DeleteAccountResponse>(`/api/v1/auth/soft-delete?message=${encodeURIComponent(message)}`),
};
