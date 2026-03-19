import { create } from 'zustand';

type PackageSize = 'S' | 'M' | 'L';

type ToBuildingForm = {
  senderPhone: string;
  recipientPhone: string;
  packageSize: PackageSize;
  categories: string[];
  comments: string;
};

type ToDoorForm = {
  pickupStreet: string;
  pickupDetails: string;
  senderPhone: string;
  deliveryStreet: string;
  deliveryDetails: string;
  recipientPhone: string;
  packageSize: PackageSize;
  categories: string[];
  comments: string;
};

type CourierBookingState = {
  activeTab: 'building' | 'door';
  toBuilding: ToBuildingForm;
  toDoor: ToDoorForm;
  setActiveTab: (tab: 'building' | 'door') => void;
  setToBuildingField: (field: Partial<ToBuildingForm>) => void;
  setToDoorField: (field: Partial<ToDoorForm>) => void;
  reset: () => void;
};

const defaultToBuilding: ToBuildingForm = {
  senderPhone: '',
  recipientPhone: '',
  packageSize: 'S',
  categories: [],
  comments: '',
};

const defaultToDoor: ToDoorForm = {
  pickupStreet: '',
  pickupDetails: '',
  senderPhone: '',
  deliveryStreet: '',
  deliveryDetails: '',
  recipientPhone: '',
  packageSize: 'S',
  categories: [],
  comments: '',
};

export const useCourierBookingStore = create<CourierBookingState>((set) => ({
  activeTab: 'building',
  toBuilding: defaultToBuilding,
  toDoor: defaultToDoor,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setToBuildingField: (field) =>
    set((state) => ({ toBuilding: { ...state.toBuilding, ...field } })),
  setToDoorField: (field) =>
    set((state) => ({ toDoor: { ...state.toDoor, ...field } })),
  reset: () => set({ toBuilding: defaultToBuilding, toDoor: defaultToDoor, activeTab: 'building' }),
}));
