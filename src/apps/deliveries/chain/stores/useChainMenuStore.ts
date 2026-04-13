import { create } from 'zustand';

type ChainMenuState = {
  selectedMenuTemplateId: string | null;
  setSelectedMenuTemplateId: (menuTemplateId: string) => void;
  clearSelectedMenuTemplateId: () => void;
};

export const useChainMenuStore = create<ChainMenuState>((set) => ({
  selectedMenuTemplateId: null,
  setSelectedMenuTemplateId: (menuTemplateId) =>
    set((state) => (
      state.selectedMenuTemplateId === menuTemplateId
        ? state
        : { selectedMenuTemplateId: menuTemplateId }
    )),
  clearSelectedMenuTemplateId: () =>
    set((state) => (
      state.selectedMenuTemplateId === null
        ? state
        : { selectedMenuTemplateId: null }
    )),
}));
