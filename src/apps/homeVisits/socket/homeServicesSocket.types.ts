import type { LatLng } from 'react-native-maps';
import type { SocketAck } from '../../../general/services/socket';
import type { HomeVisitsSingleVendorContractDetails } from '../singleVendor/api/types';

export type HomeServicesSocketAck<TResponse = unknown> = SocketAck<TResponse>;

export type JobStatusUpdatedEvent = {
  jobId: string;
  jobStatus: string;
  previousJobStatus: string | null;
  serviceCenterId: string | null;
  workerId: string | null;
  riderId: string | null;
  updatedAt: string;
  actor?: string | null;
  message?: string | null;
};

export type ContractUpdatedEvent = {
  contract: HomeVisitsSingleVendorContractDetails;
  updatedAt: string;
  actor?: string | null;
  message?: string | null;
};

export type WorkerLocationEvent = {
  orderId?: string;
  workerUserId?: string;
  customerUserId?: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
  distanceKm?: number | null;
  estimatedMinutes?: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
  routePath?: LatLng[] | null;
};

export type HomeServicesClientEventMap = {
  'add-user': string;
};

export type HomeServicesServerEventMap = {
  'job-status-updated': JobStatusUpdatedEvent;
  'get-worker-location': WorkerLocationEvent;
  'contract-updated': ContractUpdatedEvent;
};

export type HomeServicesClientEventName = keyof HomeServicesClientEventMap;
export type HomeServicesServerEventName = keyof HomeServicesServerEventMap;
