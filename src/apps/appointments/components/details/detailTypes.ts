export type TeamMember = {
  id: string;
  name: string;
  role: string;
  rating?: string | null;
  accentColor: string;
  imageUrl?: string | null;
};

export type ReviewPreview = {
  id: string;
  author: string;
  date: string;
  body: string;
  rating: number;
};

export type AdditionalInfoItem = {
  id: string;
  icon: string;
  label: string;
  iconType?: 'Ionicons' | 'MaterialIcons' | 'FontAwesome5' | 'Feather';
};

export type OpeningDay = {
  day: string;
  value: string;
  isActive: boolean;
};
