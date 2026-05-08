import type { NavigatorScreenParams } from '@react-navigation/native';
import type { RideSharingStackParamList } from '../../rideSharing/navigation/RideSharingNavigator';
import type { DeliveriesStackParamList } from '../../deliveries/navigation/types';
import { MiniAppId } from '../../../general/utils/constants';

export type SelectMiniAppFn = (
  id: MiniAppId,
  params?:
    | NavigatorScreenParams<RideSharingStackParamList>
    | NavigatorScreenParams<DeliveriesStackParamList>,
) => void;
