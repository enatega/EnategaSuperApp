import { create } from "zustand";

export type SignupFormData = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export type OtpType = "sms" | "email" | "call";

export type FlowType = "signup" | "login";

type SignupState = {
  // Form data
  formData: SignupFormData;

  // OTP state
  otpType: OtpType;
  otpSent: boolean;

  // flow state
  flowType: FlowType;

  // Actions
  setFormData: (data: Partial<SignupFormData>) => void;
  setOtpType: (type: OtpType) => void;
  setFlowType: (type: FlowType) => void;
  setOtpSent: (sent: boolean) => void;
  resetSignup: () => void;
};

const initialFormData: SignupFormData = {
  name: "kashif",
  email: "kashif12@gmail.com",
  password: "Qwerty123$",
  phone: "3431412212",
};

export const useAuthStore = create<SignupState>((set) => ({
  formData: initialFormData,
  otpType: "sms",
  otpSent: false,
  flowType: "login",

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setOtpType: (type) => set({ otpType: type }),

  setFlowType: (type) => set({ flowType: type }),

  setOtpSent: (sent) => set({ otpSent: sent }),

  resetSignup: () =>
    set({
      formData: initialFormData,
      otpType: "sms",
      otpSent: false,
    }),
}));
