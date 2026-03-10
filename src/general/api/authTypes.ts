export type OtpType = "sms" | "email" | "call";

export type User = {
  id: string;
  email?: string | null;
  phone: string;
  name: string;
  active_status: boolean;
};

export type Profile = Array<{
  key: string;
  data: Record<string, unknown>;
}>;

export type SignupSendOtpPayload = {
  phone?: string;
  email?: string;
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
  email?: string;
  otp: string;
  name: string;
  password: string;
  otp_type: string;
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

export type EmailLoginPayload = {
  email: string;
  password: string;
  device_push_token?: string;
};

export type EmailLoginRespoce = {
  user: User;
  profiles: Profile;
  accessToken: string;
};

export type GoogleLoginPayload = {
  idToken: string;
  user_type_id: string;
  device_push_token?: string;
};

export type GoogleLoginResponse = {
  user: User;
  profiles: Profile;
  accessToken: string;
};

export type SendForgotPasswordOtpPayload = {
  email: string;
  otp_type: 'email' | 'sms' | 'call';
}

export type SendForgotPasswordOtpResponce = {
  message: string;
}

export type VerifyForgotPasswordOtpPayload = {
  email: string;
  otp: string;
  otp_type: 'email' | 'sms' | 'call';
}

export type VerifyForgotPasswordOtpResponce = {
  message: string;
  userId: string;
}

export type ResetPasswordPayload = {
  userId: string;
  password: string
}

export type ResetPasswordResponce = {
  message: string;
}