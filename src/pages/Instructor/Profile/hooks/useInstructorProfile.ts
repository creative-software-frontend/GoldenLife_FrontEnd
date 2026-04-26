import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string | number;
  mobile_verify: string;
  balance: string;
  image?: string;
  profile_image?: string;
}

interface Instructor {
  id: number;
  user_id: string;
  instructor_id: string;
  name: string;
  joining_date: string;
  gender: string;
  qualification: string;
  experience: string;
  designation: string;
  department: string;
  business_name: string;
  date_of_birth: string;
  website: string | null;
  facebook: string | null;
  telegram: string | null;
  whatsapp: string | null;
  mobile: string;
  email: string;
  image: string;
}

interface ProfileData {
  user: User;
  instructor: Instructor;
}

export function useInstructorProfile() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const session = sessionStorage.getItem('instructor_session');
      const token = session ? JSON.parse(session).token : null;

      if (!token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      const url = `${baseURL}/api/instructor/profile`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Based on the JSON provided in the request
      if (response.data && response.data.user && response.data.instructor) {
        setData(response.data);
      } else {
        throw new Error('Invalid profile data received');
      }

      setError(null);
    } catch (err: any) {
      console.error('❌ [useInstructorProfile] Failed to fetch:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (formData: FormData): Promise<boolean> => {
    try {
      const session = sessionStorage.getItem('instructor_session');
      const token = session ? JSON.parse(session).token : null;

      if (!token) throw new Error('Authentication required');

      const response = await axios.post(
        `${baseURL}/api/instructor/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data?.success || response.data?.status === 'success' || response.data?.message?.toLowerCase()?.includes('success')) {
        await fetchProfile();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      throw new Error(err.response?.data?.message || err.message || 'Failed to update profile');
    }
  };

  const deleteField = async (field: string): Promise<boolean> => {
    try {
      const session = sessionStorage.getItem('instructor_session');
      const token = session ? JSON.parse(session).token : null;

      if (!token) throw new Error('Authentication required');

      const response = await axios.post(
        `${baseURL}/api/instructor/profile/delete-field`,
        { field },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data?.success || response.data?.status === 'success' || response.data?.message?.toLowerCase()?.includes('success')) {
        await fetchProfile();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Failed to delete field:', err);
      throw new Error(err.response?.data?.message || err.message || 'Failed to delete field');
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchProfile,
    updateProfile,
    deleteField
  };
}
