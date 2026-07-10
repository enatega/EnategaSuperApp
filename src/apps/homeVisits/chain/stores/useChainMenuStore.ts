import { create } from 'zustand';

type ChainMenuState = {
  selectedMenuTemplateId: string | null;
  setSelectedMenuTemplateId: (menuTemplateId: string) => void;
  clearSelectedMenuTemplateId: () => void;
};

export const useChainMenuStore = create<ChainMenuState>((set) => ({
  selectedMenuTemplateId: null,
  setSelectedMenuTemplateId: (menuTemplateId) =>
    set({ selectedMenuTemplateId: menuTemplateId }),
  clearSelectedMenuTemplateId: () => set({ selectedMenuTemplateId: null }),
}));
