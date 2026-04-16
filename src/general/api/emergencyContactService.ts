import apiClient from './apiClient';
import type { GlobalEmergencyContact } from '../stores/useAppConfigStore';

type EmergencyContactResponse = {
  data: GlobalEmergencyContact;
  message: string;
};

export const emergencyContactService = {
  fetchActive: async (): Promise<GlobalEmergencyContact> => {
    const response = await apiClient.get<EmergencyContactResponse | GlobalEmergencyContact>(
      '/api/v1/admin/global-emergency-contacts/active',
    );
    // Handle both { data: {...} } and flat response shapes
    if (response && typeof response === 'object' && 'data' in response && response.data && 'contact_number' in response.data) {
      return (response as EmergencyContactResponse).data;
    }
    return response as GlobalEmergencyContact;
  },
};
