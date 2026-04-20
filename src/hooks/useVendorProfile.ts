import { useState, useEffect } from 'react';
import axios from 'axios';
import { getVendorImageUrl } from '@/utils/imageHelpers';

interface VendorProfile {
  user: {
    id: number;
    name: string;
    email: string;
    mobile: string;
    image?: string;
  };
  vendor: {
    id: number;
    seller_id: string;
    business_name: string;
    owner_name: string;
    image?: string;
  };
}

export function useVendorProfile() {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const session = sessionStorage.getItem('vendor_session');
      if (!session) {
        setIsLoading(false);
        return;
      }

      const token = JSON.parse(session).token;
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${baseURL}/api/vendor/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profileData = response.data?.data || response.data;
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch vendor profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    refetch: fetchProfile,
  };
}

// Helper to get display name
export const getVendorDisplayName = (profile: VendorProfile | null): string => {
  if (!profile) return 'Vendor';
  return profile.vendor?.business_name || profile.user?.name || 'Vendor';
};

// Helper to get avatar URL
export const getVendorAvatarUrl = (profile: VendorProfile | null): string => {
  if (!profile) return '';

  // Try vendor image first
  const vendorImage = profile.vendor?.image;
  if (vendorImage) {
    return getVendorImageUrl(vendorImage);
  }

  // Fallback to user image
  const userImage = profile.user?.image;
  if (userImage) {
    return getVendorImageUrl(userImage);
  }

  return '';
};
