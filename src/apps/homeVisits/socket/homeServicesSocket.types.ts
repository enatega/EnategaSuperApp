import type { SocketAck } from '../../../general/services/socket';

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

export type WorkerLocationEvent = {
  workerUserId?: string;
  customerUserId?: string;
  latitude: number;
  longitude: number;
};

export type HomeServicesClientEventMap = {
  'add-user': string;
};

export type HomeServicesServerEventMap = {
  'job-status-updated': JobStatusUpdatedEvent;
  'get-worker-location': WorkerLocationEvent;
};

export type HomeServicesClientEventName = keyof HomeServicesClientEventMap;
export type HomeServicesServerEventName = keyof HomeServicesServerEventMap;
