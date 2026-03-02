import generalEn from './general/en';
import generalFr from './general/fr';
import deliveriesEn from '../../apps/deliveries/localization/en';
import deliveriesFr from '../../apps/deliveries/localization/fr';
import rideSharingEn from '../../apps/rideSharing/localization/en';
import rideSharingFr from '../../apps/rideSharing/localization/fr';
import homeVisitsEn from '../../apps/homeVisits/localization/en';
import homeVisitsFr from '../../apps/homeVisits/localization/fr';
import appointmentsEn from '../../apps/appointments/localization/en';
import appointmentsFr from '../../apps/appointments/localization/fr';

export const translations = {
  en: {
    general: generalEn,
    deliveries: deliveriesEn,
    rideSharing: rideSharingEn,
    homeVisits: homeVisitsEn,
    appointments: appointmentsEn,
  },
  fr: {
    general: generalFr,
    deliveries: deliveriesFr,
    rideSharing: rideSharingFr,
    homeVisits: homeVisitsFr,
    appointments: appointmentsFr,
  },
} as const;

export type Language = keyof typeof translations;
export type Namespace = keyof typeof translations.en;
