import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { tokenManager } from '../../../general/api/apiClient';
import {
  socketBaseUrl,
  socketPath,
} from '../../../general/services/socket/socket.config';
import { appointmentKeys } from '../api/queryKeys';

export type AppointmentBookingStatusUpdatedPayload = {
  bookingId: string;
  bookingStatus: string;
  storeId: string | null;
  updatedAt: string;
};

export function useAppointmentBookingStatusSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let isDisposed = false;
    let disconnect: (() => void) | undefined;

    const connect = async () => {
      const token = await tokenManager.getToken();
      if (isDisposed || !token) return;

      const socket = io(`${socketBaseUrl}/general-bookings`, {
        autoConnect: false,
        auth: { token },
        path: socketPath,
        reconnection: true,
        transports: ['websocket'],
      });

      const handleStatusUpdate = (
        payload: AppointmentBookingStatusUpdatedPayload,
      ) => {
        console.info('[appointments][socket] booking status updated', payload);
        void queryClient.invalidateQueries({
          queryKey: appointmentKeys.bookings(),
        });
      };

      socket.on('general-booking-status-updated', handleStatusUpdate);
      socket.connect();

      disconnect = () => {
        socket.off('general-booking-status-updated', handleStatusUpdate);
        socket.disconnect();
      };
    };

    void connect();

    return () => {
      isDisposed = true;
      disconnect?.();
    };
  }, [queryClient]);
}
