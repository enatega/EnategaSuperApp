export type RideIntent = 'now' | 'schedule' | 'rental' | 'courier';

export type RideCategory = string;

export function mapIntentToCategory(intent?: RideIntent): RideCategory {
  if (intent === 'courier') return 'courier';
  return 'ride';
}
