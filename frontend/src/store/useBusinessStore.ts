import { create } from 'zustand';

interface BusinessState {
  businessType: string | null;
  inventoryData: any[] | null;
  isOnboardingComplete: boolean;
  setBusinessType: (type: string) => void;
  setInventoryData: (data: any[]) => void;
  clearBusinessType: () => void;
  setOnboardingComplete: (status: boolean) => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  businessType: null,
  inventoryData: null,
  isOnboardingComplete: false,
  setBusinessType: (type) => set({ businessType: type }),
  setInventoryData: (data) => set({ inventoryData: data, isOnboardingComplete: true }),
  clearBusinessType: () => set({ businessType: null, inventoryData: null, isOnboardingComplete: false }),
  setOnboardingComplete: (status) => set({ isOnboardingComplete: status }),
}));
