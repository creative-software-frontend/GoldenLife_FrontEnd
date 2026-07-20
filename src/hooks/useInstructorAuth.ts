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
const extractError = (err: any): string => {
  const data = err?.response?.data;
  
  if (!data) return err?.message || 'An unexpected error occurred.';

  // 1. Check for 'message' field
  if (data.message) {
    if (typeof data.message === 'string') return data.message;
    if (typeof data.message === 'object') {
      // If it's an object, try to get the first value
      const firstKey = Object.keys(data.message)[0];
      const firstVal = data.message[firstKey];
      return Array.isArray(firstVal) ? firstVal[0] : String(firstVal);
    }
  }

  // 2. Check for 'error' field
  if (data.error) {
    return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
  }

  // 3. Check for 'errors' validation object (common in Laravel)
  if (data.errors && typeof data.errors === 'object') {
    const firstKey = Object.keys(data.errors)[0];
    const firstVal = data.errors[firstKey];
    return Array.isArray(firstVal) ? firstVal[0] : String(firstVal);
  }

  return err?.message || 'An unexpected error occurred.';
};

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
      try {
        const response = await axios.post<LoginResponse>(`${baseURL}/api/instructor/login`, payload, {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        });
        const data = response.data;
        if (!data.token) throw new Error('No token received from server.');
        storeInstructorSession(data.token, data.user);
        return data;
      } catch (err: any) {
        throw new Error(extractError(err));
      }
    }
  });

/**
 * 4th: Send Login OTP to mobile
 * POST /api/instructor/login-otp-send  (form-data body: mobile)
 * Response: { success, message }
 */
export const useSendLoginOtpMutation = () =>
  useMutation<SendLoginOtpResponse, Error, SendLoginOtpPayload>({
    mutationFn: async ({ mobile }) => {
      try {
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
      } catch (err: any) {
        throw new Error(extractError(err));
      }
    }
  });

/**
 * 5th: Verify Login OTP
 * POST /api/instructor/login-otp-verify  (form-data body: mobile, otp)
 * Response: { success, token, user }
 */
export const useVerifyLoginOtpMutation = () =>
  useMutation<VerifyLoginOtpResponse, Error, VerifyLoginOtpPayload>({
    mutationFn: async ({ mobile, otp }) => {
      try {
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
      } catch (err: any) {
        throw new Error(extractError(err));
      }
    }
  });

/**
 * 2nd: Register new Instructor
 * POST /api/instructor/register  (form-data)
 * Response: { success, message, user_id }
 */
export const useInstructorRegisterMutation = () =>
  useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: async (payload) => {
      try {
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
      } catch (err: any) {
        throw new Error(extractError(err));
      }
    }
  });

/**
 * 3rd: Verify Registration OTP
 * POST /api/instructor/verify-otp?user_id=X&otp=Y
 * Response: { success, message, user, token } — logs the user in on success
 */
export const useVerifyRegisterOtpMutation = () =>
  useMutation<VerifyRegisterOtpResponse, Error, VerifyRegisterOtpPayload>({
    mutationFn: async ({ user_id, otp }) => {
      try {
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
      } catch (err: any) {
        throw new Error(extractError(err));
      }
    }
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
        `${baseURL}/api/instructor/WebDashboard`,
        {
          headers: { 'X-Auth-Token': `Bearer ${token}`, Accept: 'application/json' }
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
      try {
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
      } catch (err: any) {
        throw new Error(extractError(err));
      }
    }
  });

/**
 * Reset Password (includes OTP verification in one call)
 * POST /api/password/reset  (form-data body: otp, password, password_confirmation, mobile)
 * Response: { success, message }
 */
export const useResetPasswordMutation = () =>
  useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: async ({ mobile, otp, password, password_confirmation }) => {
      try {
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
      } catch (err: any) {
        throw new Error(extractError(err));
      }
    }
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

// ─── Change Password (when logged in) ───────────────────────────────────────────

export interface InstructorChangePasswordPayload {
  old_password: string;
  password: string;
  password_confirmation: string;
}

export interface InstructorChangePasswordResponse {
  status: boolean;
  message: string;
}

/**
 * Change Password (when logged in)
 * POST /api/instructor/password/update
 * Response: { status, message }
 */
export const useInstructorChangePasswordMutation = () =>
  useMutation<InstructorChangePasswordResponse, Error, InstructorChangePasswordPayload>({
    mutationFn: async (payload) => {
      try {
        const token = getInstructorToken();
        const response = await axios.post<InstructorChangePasswordResponse>(
          `${baseURL}/api/instructor/password/update`,
          payload,
          {
            headers: {
              'X-Auth-Token': `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );
        return response.data;
      } catch (err: any) {
        throw new Error(extractError(err));
      }
    },
  });

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
  status?: string | number;
  download_url?: string | null;
  modules?: Array<{
    id: number;
    module_title: string;
    serial_number?: number;
    lessons: Array<{
      id: number;
      lesson_title: string;
      description?: string | null;
      serial_number?: number;
      is_free?: number;
      videos: Array<{
        id: number;
        video_title?: string | null;
        video_url: string;
        duration?: string | null;
      }>;
    }>;
  }>;
  quizzes?: Array<{
    id: number;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
    points: number;
    created_at?: string;
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
            headers: { 'X-Auth-Token': `Bearer ${token}`, Accept: 'application/json' },
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
        headers: { 'X-Auth-Token': `Bearer ${token}`, Accept: 'application/json' },
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
        headers: { 'X-Auth-Token': `Bearer ${token}`, Accept: 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructorCourses'] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['instructorCourseDetails', String(id)] });
      }
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
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Auto-refresh every 60 seconds
    refetchOnWindowFocus: true, // Refresh when user returns to the tab
    queryFn: async () => {
      const token = getInstructorToken();
      const response = await axios.get(
        `${baseURL}/api/instructor/courses`,
        {
          params: type && type !== 'All' ? { type } : {},
          headers: { 'X-Auth-Token': `Bearer ${token}`, Accept: 'application/json' }
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
        headers: { 'X-Auth-Token': `Bearer ${token}`, Accept: 'application/json' },
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
// ─── Modules ────────────────────────────────────────────────────────────────
export const useAddModuleMutation = () => {
  const queryClient = useQueryClient();
  const token = getInstructorToken();

  return useMutation({
    mutationFn: async ({ courseId, data }: { courseId: string | number; data: any }) => {
      const response = await axios.post(`${baseURL}/api/courses/${courseId}/modules`, data, {
        headers: { 'X-Auth-Token': `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['instructorCourseDetails', String(courseId)] });
    },
  });
};

export const useUpdateModuleMutation = () => {
  const queryClient = useQueryClient();
  const token = getInstructorToken();

  return useMutation({
    mutationFn: async ({ moduleId, courseId, data }: { moduleId: string | number; courseId: string | number; data: any }) => {
      const response = await axios.put(`${baseURL}/api/modules/${moduleId}`, data, {
        headers: { 'X-Auth-Token': `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['instructorCourseDetails', String(courseId)] });
    },
  });
};

export const useDeleteModuleMutation = () => {
  const queryClient = useQueryClient();
  const token = getInstructorToken();

  return useMutation({
    mutationFn: async ({ moduleId, courseId }: { moduleId: string | number; courseId: string | number }) => {
      const response = await axios.delete(`${baseURL}/api/modules/${moduleId}`, {
        headers: { 'X-Auth-Token': `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['instructorCourseDetails', String(courseId)] });
    },
  });
};

// ─── Lessons ───────────────────────────────────────────────────────────────
export const useAddLessonMutation = () => {
  const queryClient = useQueryClient();
  const token = getInstructorToken();

  return useMutation({
    mutationFn: async ({ moduleId, courseId, data }: { moduleId: string | number; courseId: string | number; data: any }) => {
      const response = await axios.post(`${baseURL}/api/modules/${moduleId}/lessons`, data, {
        headers: { 'X-Auth-Token': `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['instructorCourseDetails', String(courseId)] });
    },
  });
};

export const useUpdateLessonMutation = () => {
  const queryClient = useQueryClient();
  const token = getInstructorToken();

  return useMutation({
    mutationFn: async ({ lessonId, courseId, data }: { lessonId: string | number; courseId: string | number; data: any }) => {
      const response = await axios.put(`${baseURL}/api/lessons/${lessonId}`, data, {
        headers: { 'X-Auth-Token': `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['instructorCourseDetails', String(courseId)] });
    },
  });
};

export const useDeleteLessonMutation = () => {
  const queryClient = useQueryClient();
  const token = getInstructorToken();

  return useMutation({
    mutationFn: async ({ lessonId, courseId }: { lessonId: string | number; courseId: string | number }) => {
      const response = await axios.delete(`${baseURL}/api/lessons/${lessonId}`, {
        headers: { 'X-Auth-Token': `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['instructorCourseDetails', String(courseId)] });
    },
  });
};
// ─── Quizzes ───────────────────────────────────────────────────────────────
export const useAddQuizMutation = () => {
  const queryClient = useQueryClient();
  const token = getInstructorToken();

  return useMutation({
    mutationFn: async ({ lessonId, courseId, data }: { lessonId: string | number; courseId: string | number; data: any }) => {
      const response = await axios.post(`${baseURL}/api/lessons/${lessonId}/quizzes`, data, {
        headers: { 'X-Auth-Token': `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['instructorCourseDetails', String(courseId)] });
    },
  });
};

export const useUpdateQuizMutation = () => {
  const queryClient = useQueryClient();
  const token = getInstructorToken();

  return useMutation({
    mutationFn: async ({ quizId, courseId, data }: { quizId: string | number; courseId: string | number; data: any }) => {
      const response = await axios.put(`${baseURL}/api/quizzes/${quizId}`, data, {
        headers: { 'X-Auth-Token': `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['instructorCourseDetails', String(courseId)] });
    },
  });
};

export const useDeleteQuizMutation = () => {
  const queryClient = useQueryClient();
  const token = getInstructorToken();

  return useMutation({
    mutationFn: async ({ quizId, courseId }: { quizId: string | number; courseId: string | number }) => {
      const response = await axios.delete(`${baseURL}/api/quizzes/${quizId}`, {
        headers: { 'X-Auth-Token': `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['instructorCourseDetails', String(courseId)] });
    },
  });
};
