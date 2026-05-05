import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

export interface NavbarUserInfo {
  name: string;
  email: string;
  image: string;
}

export interface NavbarResponse {
  balance: string;
  status: boolean;
  count: number;
  notifications: any[];
  user_info: NavbarUserInfo;
}

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

/**
 * Fetch Instructor Navbar data (Balance, Notifications, Info)
 * GET /api/navbar (Bearer token required)
 */
export const useInstructorNavbarQuery = () => {
  return useQuery<NavbarResponse>({
    queryKey: ['instructorNavbar'],
    queryFn: async () => {
      const token = getInstructorToken();
      const response = await axios.get<NavbarResponse>(`${baseURL}/api/navbar`, {
        headers: { 'X-Auth-Token': `Bearer ${token}`, Accept: 'application/json' },
      });
      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
};
