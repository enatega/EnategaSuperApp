import { RideCategory } from '../../utils/rideOptions';

export type RideOptionItem = {
  id: RideCategory;
  title: string;
  icon: string;
  seats?: number;
  showSnowflake?: boolean;
};

export type RecentLocation = {
  id: string;
  title: string;
  subtitle: string;
};
