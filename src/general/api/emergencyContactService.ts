import apiClient from './apiClient';

export type GlobalEmergencyContact = {
  id: string;
  title: string;
  contact_number: string;
  is_active: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
};

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
