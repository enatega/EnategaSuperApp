export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

export const notificationSettingsKeys = {
  all: ['notification-settings'] as const,
  detail: () => [...notificationSettingsKeys.all, 'detail'] as const,
};
