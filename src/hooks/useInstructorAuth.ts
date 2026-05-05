import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  user?: any;
  token?: string;
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
 * POST /api/instructor/verify-otp?user_id=X&otp=Y
 * Response: { success, message, user, token } — logs the user in on success
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
      const data = response.data;
      if (!data.success) {
        throw new Error(data.message || 'OTP verification failed.');
      }
      // The verify-otp endpoint returns a token → store session immediately
      if (data.token) {
        storeInstructorSession(data.token, data.user);
      }
      return data;
    },
    onError: (err: any) => {
      throw new Error(extractError(err));
    },
  });

// ─── Dashboard Query ─────────────────────────────────────────────────────────

export interface InstructorDashboardData {
  active_orders: number;
  total_revenue: number;
  overview: {
    total_parcel: { count: number; amount: number };
    delivered: { count: number; amount: number };
    pending: { count: number; amount: number };
    cancel: { count: number; percentage: number; amount: number };
  };
  store_rating: number;
  sales_charts: {
    week: { highest: number; lowest: number; performance: { date_label: string; total_sales: string }[] };
    month: { highest: number; lowest: number; performance: { date_label: string; total_sales: string }[] };
    year: { highest: number; lowest: number; performance: { date_label: string; total_sales: string }[] };
  };
  inventory: { low_stock_count: number };
  recent_orders: {
    id: number;
    order_no: string;
    user_name: string;
    user_phone: string;
    total: string;
    status: string;
    created_at: string;
  }[];
}

/**
 * Fetch Instructor Dashboard data
 * GET /api/vendor/WebDashboard  (Bearer token required)
 */
export const useInstructorDashboardQuery = () => {
  const getToken = () => {
    try {
      const raw = sessionStorage.getItem('instructor_session');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed.expiry && new Date().getTime() > parsed.expiry) return null;
      return parsed.token || null;
    } catch {
      return null;
    }
  };

  return useQuery<InstructorDashboardData>({
    queryKey: ['instructorDashboard'],
    queryFn: async () => {
      const token = getToken();
      const response = await axios.get<{ status: boolean; data: InstructorDashboardData }>(
        `${baseURL}/api/instructor/dashboard`,
        { headers: { X- Auth - Token: `Bearer ${token}`, Accept: 'application/json' }
  }
  );
  if (!response.data.status) throw new Error('Failed to load dashboard data.');
  return response.data.data;
},
  staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
  });
};

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

// ─── Course Helpers ───────────────────────────────────────────────────────────

/** Read instructor token from sessionStorage */
const getInstructorToken = (): string | null => {
  try {
    const raw = sessionStorage.getItem('instructor_session');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.expiry && new Date().getTime() > parsed.expiry) return null;
    return parsed.token || null;
  } catch {
    return null;
  }
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CourseData {
  id: number;
  course_title_english: string;
  course_title_bangla: string;
  course_type: string;
  category: string;
  course_code: string;
  course_duration: string;
  seller_fee: string | number;
  regular_fee: string | number;
  offer_fee: string | number;
  earning_value: string | number;
  course_details_english: string;
  course_details_bangla: string;
  video_url?: string;
  image?: string;
  modules?: Array<{
    id: number;
    module_title: string;
    lessons: Array<{
      id: number;
      lesson_title: string;
      videos: Array<{
        id: number;
        video_url: string;
        duration?: string | null;
      }>;
    }>;
  }>;
}

// ─── Fetch single course ──────────────────────────────────────────────────────

/**
 * Fetch a single course by ID
 * GET /api/instructor/courses/show?id=:id
 */
export const useInstructorCourseQuery = (id: string | undefined) =>
  useQuery<CourseData>({
    queryKey: ['instructorCourse', id],
    enabled: !!id,
    staleTime: 60 * 1000,
    queryFn: async () => {
      const token = getInstructorToken();
      try {
        console.log(`Fetching course ${id} from: ${baseURL}/api/instructor/courses/show`);
        const response = await axios.get(
          `${baseURL}/api/instructor/courses/show`,
          {
            params: { id },
            headers: { X- Auth - Token: `Bearer ${token}`, Accept: 'application/json' },
    }
        );
console.log('Course fetch response:', response.data);
const payload = response.data?.data ?? response.data;
if (!payload) throw new Error('Course not found.');
return payload as CourseData;
      } catch (err: any) {
  console.error('Course fetch error:', err.response || err);
  throw err;
}
    },
  });

// ─── Create course ────────────────────────────────────────────────────────────

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, FormData>({
    mutationFn: async (fd) => {
      const token = getInstructorToken();
      await axios.post(`${baseURL}/api/courses/store`, fd, {
        headers: { X- Auth - Token: `Bearer ${token}`, Accept: 'application/json' },
  });
},
  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructorCourses'] });
    },
onError: (err: any) => { throw new Error(extractError(err)); },
  });
};

// ─── Update course ────────────────────────────────────────────────────────────

/**
 * Update an existing course
 * POST /api/instructor/courses/update?id=:id  (multipart/form-data)
 */
export const useUpdateCourseMutation = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, FormData>({
    mutationFn: async (fd) => {
      const token = getInstructorToken();
      await axios.post(`${baseURL}/api/courses/update`, fd, {
        params: { id },
        headers: { X- Auth - Token: `Bearer ${token}`, Accept: 'application/json' },
  });
},
  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructorCourses'] });
    },
onError: (err: any) => { throw new Error(extractError(err)); },
  });
};

// ─── Fetch instructor courses list ────────────────────────────────────────────

/**
 * Fetch all courses belonging to the logged-in instructor (with optional type filtering)
 * GET /api/instructor/courses?type=...
 */
export const useInstructorCoursesQuery = (type?: string) =>
  useQuery<CourseData[]>({
    queryKey: ['instructorCourses', type],
    staleTime: 60 * 1000,
    queryFn: async () => {
      const token = getInstructorToken();
      const response = await axios.get(
        `${baseURL}/api/instructor/courses`,
        {
          params: type && type !== 'All' ? { type } : {},
          headers: { X- Auth - Token: `Bearer ${token}`, Accept: 'application/json' }
  }
  );
// API shape: { status, count, data: [...] }
const payload = response.data?.data ?? response.data;
if (!Array.isArray(payload)) throw new Error('Unexpected response format.');
return payload as CourseData[];
    },
  });

// ─── Fetch Single Course Details ──────────────────────────────────────────────

/**
 * Fetch full course details (including modules/quizzes)
 * GET /api/course/details?id=:id
 */
export const useInstructorCourseDetailsQuery = (id: string | undefined) =>
  useQuery<CourseData>({
    queryKey: ['instructorCourseDetails', id],
    enabled: !!id,
    queryFn: async () => {
      const token = getInstructorToken();
      const response = await axios.get(`${baseURL}/api/course/details`, {
        params: { id },
        headers: { X- Auth - Token: `Bearer ${token}`, Accept: 'application/json' },
  });
return (response.data?.data ?? response.data) as CourseData;
    },
  });

// ─── Categories ───────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  category_name: string;
  category_slug: string;
  category_discription: string;
  category_image: string;
  category_icon: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all active course categories
 * GET /api/courses/category/index
 */
export const useCourseCategoriesQuery = () =>
  useQuery<Category[]>({
    queryKey: ['courseCategories'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/api/courses/category/index`, {
        headers: { Accept: 'application/json' },
      });
      const payload = response.data?.data ?? response.data;
      if (!Array.isArray(payload)) throw new Error('Unexpected response format.');
      return payload as Category[];
    },
  });
