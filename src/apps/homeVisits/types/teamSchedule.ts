import type { HomeVisitsServiceDetailsSelectionState } from './serviceDetails';

export type HomeVisitsBookingSummary = {
  totalPrice: number;
  serviceCount: number;
  durationMinutes: number;
  durationLabel: string | null;
};

export type HomeVisitsTeamScheduleMode = 'one-time' | 'contract';

export type HomeVisitsSelectedServiceSnapshot = {
  id: string;
  name: string;
  price: number;
  durationLabel?: string | null;
  isLocked?: boolean;
};

export type HomeVisitsScheduledSlot = {
  startTime: string;
  endTime: string;
};

export type HomeVisitsTeamAndScheduleRouteParams = {
  serviceId: string;
  serviceCenterId: string;
  initialSelection: HomeVisitsServiceDetailsSelectionState;
  selectedServiceIds: string[];
  selectedServices: HomeVisitsSelectedServiceSnapshot[];
  summary: HomeVisitsBookingSummary;
};

export type HomeVisitsReviewAndConfirmRouteParams =
  HomeVisitsTeamAndScheduleRouteParams & {
    teamSize: number;
    workingHours: number;
    contractDays: number;
    serviceMode: HomeVisitsTeamScheduleMode;
    scheduledAtIso: string;
    scheduledSlot: HomeVisitsScheduledSlot;
  };
