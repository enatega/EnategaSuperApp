export type RideIntent = 'now' | 'schedule' | 'rental' | 'courier';

export type RideCategory = 'ride' | 'women' | 'ac' | 'premium' | 'courier';

export function mapIntentToCategory(intent?: RideIntent): RideCategory {
  if (intent === 'courier') return 'courier';
  return 'ride';
}
