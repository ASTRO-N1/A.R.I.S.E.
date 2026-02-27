import { create } from 'zustand';

interface BusinessState {
  businessType: string | null;
  setBusinessType: (type: string) => void;
  clearBusinessType: () => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  businessType: null,
  setBusinessType: (type) => set({ businessType: type }),
  clearBusinessType: () => set({ businessType: null }),
}));
