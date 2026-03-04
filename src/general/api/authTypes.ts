export type OtpType = 'sms' | 'whatsapp' | 'email';

export type SignupSendOtpPayload = {
  phone: string;
  otp_type: OtpType;
};

export type SignupSendOtpResponse = {
  success: boolean;
  message: string;
  data: {
    success: boolean;
  };
};

export type SignupVerifyOtpPayload = {
  phone: string;
  otp: string;
  name: string;
  password: string;
  device_push_token?: string;
  referral_code?: string;
};

export type SignupVerifyOtpResponse = {
  user: {
    id: string;
    email?: string | null;
    phone: string;
    name: string;
    active_status: boolean;
  };
  profiles: Array<{
    key: string;
    data: Record<string, unknown>;
  }>;
  accessToken: string;
};

export type LoginSendOtpPayload = {
  phone: string;
  otp_type: OtpType;
  device_push_token?: string;
};

export type LoginSendOtpResponse = {
  message: string;
  phone: string;
};

export type LoginVerifyOtpPayload = {
  phone: string;
  otp: string;
  device_push_token?: string;
};

export type LoginVerifyOtpResponse = {
  user: {
    id: string;
    email?: string | null;
    phone: string;
    name: string;
    profile?: string | null;
    active_status: boolean;
  };
  profiles: Array<{
    key: string;
    data: Record<string, unknown>;
  }>;
  accessToken: string;
};
