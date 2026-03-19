import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { chatService } from '../api/chatService';
import type {
  DeliveryChatBoxesResponse,
  DeliveryChatMessagesResponse,
} from '../api/chatServiceTypes';
import { deliveryKeys } from '../api/queryKeys';

export function useDeliveryChatBoxes(userId?: string) {
  return useQuery<DeliveryChatBoxesResponse, ApiError>({
    queryKey: deliveryKeys.chatBoxes(userId ?? 'unknown'),
    queryFn: () => chatService.getChatBoxes(userId ?? ''),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });
}

export function useDeliveryChatMessages(chatBoxId?: string) {
  return useQuery<DeliveryChatMessagesResponse, ApiError>({
    queryKey: deliveryKeys.chatMessages(chatBoxId ?? 'unknown'),
    queryFn: () => chatService.getChatMessages(chatBoxId ?? ''),
    enabled: Boolean(chatBoxId),
    staleTime: 10 * 1000,
  });
}
