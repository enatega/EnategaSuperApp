import { RideCategory } from '../../utils/rideOptions';

export type RideOptionItem = {
  id: RideCategory;
  title: string;
  icon: string;
  seats?: number;
  showSnowflake?: boolean;
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
