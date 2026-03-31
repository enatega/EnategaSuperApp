import { useSocketSession } from '../../../general/hooks/useSocketSession';
import useActiveRideSocketSync from './useActiveRideSocketSync';
import { useRideBidSocket } from './useRideBidSocket';

type Options = {
  enableActiveRideSync?: boolean;
};

export default function useRideSocketSync(options?: Options) {
  useSocketSession();
  useRideBidSocket({ enabled: true });
  useActiveRideSocketSync({ enabled: options?.enableActiveRideSync ?? true });
}
