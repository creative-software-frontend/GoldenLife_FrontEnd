import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Store instructor session in sessionStorage after successful auth */
const storeInstructorSession = (token: string, user?: any) => {
  const expiry = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
  sessionStorage.setItem('instructor_session', JSON.stringify({ token, user, expiry }));
  document.cookie = `instructor_token=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;
};

/** Extract a readable error message from an axios error */
const extractError = (err: any): string =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  'An unexpected error occurred.';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  user: { id: number; name: string; email: string; role: string };
  token: string;
}

export interface SendLoginOtpPayload {
  mobile: string;
}

export interface SendLoginOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyLoginOtpPayload {
  mobile: string;
  otp: string;
}

export interface VerifyLoginOtpResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
}

export interface RegisterPayload {
  name: string;
  mobile: string;
  email: string;
  password: string;
  password_confirmation: string;
  subject?: string;
  experience?: string;
  address?: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  user_id?: number;
}

export interface VerifyRegisterOtpPayload {
  user_id: number;
  otp: string;
}

export interface VerifyRegisterOtpResponse {
  success: boolean;
  message?: string;
}

export interface ForgotPasswordPayload {
  mobile: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  user_id?: number;
}

export interface ResetPasswordPayload {
  mobile: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * 1st: Email + Password Login
 * POST /api/instructor/login  (JSON body)
 * Response: { status, message, user, token }
 */
export const useInstructorLoginMutation = () =>
  useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (payload) => {
      const response = await axios.post<LoginResponse>(`${baseURL}/api/instructor/login`, payload, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });
      const data = response.data;
      if (!data.token) throw new Error('No token received from server.');
      storeInstructorSession(data.token, data.user);
      return data;
    },
    onError: (err: any) => {
      throw new Error(extractError(err));
    },
  });

/**
 * 4th: Send Login OTP to mobile
 * POST /api/instructor/login-otp-send  (form-data body: mobile)
 * Response: { success, message }
 */
export const useSendLoginOtpMutation = () =>
  useMutation<SendLoginOtpResponse, Error, SendLoginOtpPayload>({
    mutationFn: async ({ mobile }) => {
      const formData = new FormData();
      formData.append('mobile', mobile);
      const response = await axios.post<SendLoginOtpResponse>(
        `${baseURL}/api/instructor/login-otp-send`,
        formData,
        { headers: { Accept: 'application/json' } }
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to send OTP.');
      }
      return response.data;
    },
    onError: (err: any) => {
      throw new Error(extractError(err));
    },
  });

/**
 * 5th: Verify Login OTP
 * POST /api/instructor/login-otp-verify  (form-data body: mobile, otp)
 * Response: { success, token, user }
 */
export const useVerifyLoginOtpMutation = () =>
  useMutation<VerifyLoginOtpResponse, Error, VerifyLoginOtpPayload>({
    mutationFn: async ({ mobile, otp }) => {
      const formData = new FormData();
      formData.append('mobile', mobile);
      formData.append('otp', otp);
      const response = await axios.post<VerifyLoginOtpResponse>(
        `${baseURL}/api/instructor/login-otp-verify`,
        formData,
        { headers: { Accept: 'application/json' } }
      );
      const data = response.data;
      if (!data.success || !data.token) {
        throw new Error(data.message || 'Invalid OTP or no token received.');
      }
      storeInstructorSession(data.token, data.user);
      return data;
    },
    onError: (err: any) => {
      throw new Error(extractError(err));
    },
  });

/**
 * 2nd: Register new Instructor
 * POST /api/instructor/register  (form-data)
 * Response: { success, message, user_id }
 */
export const useInstructorRegisterMutation = () =>
  useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: async (payload) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== '') formData.append(key, value as string);
      });
      const response = await axios.post<RegisterResponse>(
        `${baseURL}/api/instructor/register`,
        formData,
        { headers: { Accept: 'application/json' } }
      );
      return response.data;
    },
    onError: (err: any) => {
      throw new Error(extractError(err));
    },
  });

/**
 * 3rd: Verify Registration OTP
 * POST /instructor/verify-otp  (query params: user_id, otp)
 * Response: { success, message }
 */
export const useVerifyRegisterOtpMutation = () =>
  useMutation<VerifyRegisterOtpResponse, Error, VerifyRegisterOtpPayload>({
    mutationFn: async ({ user_id, otp }) => {
      const response = await axios.post<VerifyRegisterOtpResponse>(
        `${baseURL}/api/instructor/verify-otp`,
        null,
        {
          params: { user_id, otp },
          headers: { Accept: 'application/json' },
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'OTP verification failed.');
      }
      return response.data;
    },
    onError: (err: any) => {
      throw new Error(extractError(err));
    },
  });

/**
 * Forgot Password – Send OTP
 * POST /api/password/forgot  (form-data body: mobile)
 * Response: { success, message, user_id }
 */
export const useForgotPasswordMutation = () =>
  useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: async ({ mobile }) => {
      const formData = new FormData();
      formData.append('mobile', mobile);
      const response = await axios.post<ForgotPasswordResponse>(
        `${baseURL}/api/password/forgot`,
        formData,
        { headers: { Accept: 'application/json' } }
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to send OTP.');
      }
      return response.data;
    },
    onError: (err: any) => {
      throw new Error(extractError(err));
    },
  });

/**
 * Reset Password (includes OTP verification in one call)
 * POST /api/password/reset  (form-data body: otp, password, password_confirmation, mobile)
 * Response: { success, message }
 */
export const useResetPasswordMutation = () =>
  useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: async ({ mobile, otp, password, password_confirmation }) => {
      const formData = new FormData();
      formData.append('mobile', mobile);
      formData.append('otp', otp);
      formData.append('password', password);
      formData.append('password_confirmation', password_confirmation);
      const response = await axios.post<ResetPasswordResponse>(
        `${baseURL}/api/password/reset`,
        formData,
        { headers: { Accept: 'application/json' } }
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to reset password.');
      }
      return response.data;
    },
    onError: (err: any) => {
      throw new Error(extractError(err));
    },
  });
