import { create } from 'zustand';

interface BusinessState {
  businessType: string | null;
  inventoryData: any[] | null;
  isOnboardingComplete: boolean;
  onboardingMode: "quick" | "in-depth" | null;
  setBusinessType: (type: string) => void;
  setInventoryData: (data: any[]) => void;
  setOnboardingMode: (mode: "quick" | "in-depth" | null) => void;
  clearBusinessType: () => void;
  setOnboardingComplete: (status: boolean) => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  businessType: null,
  inventoryData: null,
  isOnboardingComplete: false,
  onboardingMode: null,
  setBusinessType: (type) => set({ businessType: type }),
  setInventoryData: (data) => set({ inventoryData: data, isOnboardingComplete: true }),
  setOnboardingMode: (mode) => set({ onboardingMode: mode }),
  clearBusinessType: () => set({ businessType: null, inventoryData: null, isOnboardingComplete: false, onboardingMode: null }),
  setOnboardingComplete: (status) => set({ isOnboardingComplete: status }),
}));
