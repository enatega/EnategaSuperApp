import type {
  AppointmentOrderAgainItem,
  PaginatedAppointmentsResponse,
} from '../../api/types';

export type SingleVendorServiceCard = AppointmentOrderAgainItem;

export type SingleVendorServiceCardsResponse =
  PaginatedAppointmentsResponse<SingleVendorServiceCard>;

export type SingleVendorDealCard = {
  dealId: string;
  dealName: string;
  serviceId: string;
  serviceName: string;
  imageUrl?: string | null;
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  discountType: string;
  discountValue: number;
};

export type SingleVendorDealsResponse =
  PaginatedAppointmentsResponse<SingleVendorDealCard>;
