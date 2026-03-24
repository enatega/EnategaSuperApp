import { useSocketSession } from '../../../general/hooks/useSocketSession';
import { useRideBidSocket } from './useRideBidSocket';

export default function useRideSocketBootstrap() {
  useSocketSession();
  useRideBidSocket({ enabled: true });
}
