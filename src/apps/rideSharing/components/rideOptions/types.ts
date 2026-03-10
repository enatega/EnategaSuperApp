import { RideCategory } from '../../utils/rideOptions';

export type RideOptionItem = {
  id: RideCategory;
  title: string;
  icon?: string | null;
  seats?: number;
  showSnowflake?: boolean;
  description?: string;
};

export type CachedAddress = {
  placeId: string;
  description: string;
  structuredFormatting: {
    mainText: string;
    secondaryText?: string;
  };
  types?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};
