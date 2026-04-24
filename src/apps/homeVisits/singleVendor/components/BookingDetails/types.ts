export type BookingDetailsLiveEvent = {
  id: string;
  source: 'api' | 'socket';
  type: string;
  message: string;
  at: string;
};
