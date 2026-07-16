export function isDeliveriesDemoModeEnabled(): boolean {
  const value = process.env.EXPO_PUBLIC_DELIVERIES_DEMO_MODE;

  if (!value) {
    return false;
  }

  switch (value.trim().toLowerCase()) {
    case '1':
    case 'true':
    case 'yes':
    case 'on':
      return true;
    default:
      return false;
  }
}
