export type NotificationMockItem = {
  id: string;
  iconName:
    | 'cube-outline'
    | 'location-outline'
    | 'wallet-outline'
    | 'checkmark-circle-outline'
    | 'shield-checkmark-outline'
    | 'receipt-outline';
  subtitleKey: string;
  titleKey: string;
};

export type NotificationMockSection = {
  data: NotificationMockItem[];
  id: 'today' | 'past';
  titleKey: string;
};

export const notificationMockSections: NotificationMockSection[] = [
  {
    id: 'today',
    titleKey: 'notifications_section_today',
    data: [
      {
        id: 'notif-today-appointment',
        iconName: 'cube-outline',
        titleKey: 'notifications_today_appointment_title',
        subtitleKey: 'notifications_today_appointment_subtitle',
      },
      {
        id: 'notif-today-location',
        iconName: 'location-outline',
        titleKey: 'notifications_today_location_title',
        subtitleKey: 'notifications_today_location_subtitle',
      },
      {
        id: 'notif-today-payment',
        iconName: 'wallet-outline',
        titleKey: 'notifications_today_payment_title',
        subtitleKey: 'notifications_today_payment_subtitle',
      },
    ],
  },
  {
    id: 'past',
    titleKey: 'notifications_section_past',
    data: [
      {
        id: 'notif-past-offer',
        iconName: 'checkmark-circle-outline',
        titleKey: 'notifications_past_offer_title',
        subtitleKey: 'notifications_past_offer_subtitle',
      },
      {
        id: 'notif-past-rating',
        iconName: 'shield-checkmark-outline',
        titleKey: 'notifications_past_rating_title',
        subtitleKey: 'notifications_past_rating_subtitle',
      },
      {
        id: 'notif-past-receipt',
        iconName: 'receipt-outline',
        titleKey: 'notifications_past_receipt_title',
        subtitleKey: 'notifications_past_receipt_subtitle',
      },
    ],
  },
];
