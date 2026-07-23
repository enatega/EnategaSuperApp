import React from 'react';
import NotificationSettingsScreen from '../../../../general/screens/settings/NotificationSettingsScreen';

export default function AppointmentsNotificationSettingsScreen() {
  return (
    <NotificationSettingsScreen
      appPrefix="appointments"
      serviceSectionTitle="Appointment updates"
    />
  );
}
