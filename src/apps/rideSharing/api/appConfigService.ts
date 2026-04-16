import apiClient from '../../../general/api/apiClient';
import { emergencyContactService } from '../../../general/api/emergencyContactService';
import type {
  AppCurrency,
  GlobalEmergencyContact,
} from '../../../general/stores/useAppConfigStore';

const RIDE_SHARING_APP_CONFIG_BASE = '/api/v1/apps/ride-hailing';

export const rideSharingAppConfigService = {
  getCurrencies: async (): Promise<AppCurrency[]> => {
    const response = await apiClient.get<AppCurrency[]>(
      `${RIDE_SHARING_APP_CONFIG_BASE}/currency`,
    );

    return Array.isArray(response) ? response : [];
  },

  getEmergencyContact: (): Promise<GlobalEmergencyContact> =>
    emergencyContactService.fetchActive(),
};
