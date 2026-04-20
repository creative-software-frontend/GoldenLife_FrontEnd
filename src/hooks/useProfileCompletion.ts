import { useMemo } from 'react';

interface Vendor {
  businee_name?: string;
  owner_name?: string;
  mobile?: string;
  country?: string;
  district?: string;
  address?: string;
  website?: string;
  facebook?: string;
  whatsapp?: string;
  image?: string;
  profile_image?: string;
}

interface ProfileCompletionResult {
  percentage: number;
  missingFields: string[];
  isComplete: boolean;
  completedCount: number;
  requiredCount: number;
}

/**
 * Calculates vendor profile completion percentage
 * Tracks required fields (each counts as 10%):
 * - Business Name
 * - Owner Name
 * - Business Mobile
 * - Country
 * - District
 * - Address
 * 
 * Optional fields (skipped if empty):
 * - Website
 * - Facebook
 * - WhatsApp
 * - Profile Image
 */
export const useProfileCompletion = (vendor: Vendor | undefined): ProfileCompletionResult => {
  return useMemo(() => {
    if (!vendor) {
      return {
        percentage: 0,
        missingFields: [],
        isComplete: false,
        completedCount: 0,
        requiredCount: 6
      };
    }

    // Define fields to track
    const fields = [
      { name: 'Business Name', value: vendor.businee_name, required: true },
      { name: 'Owner Name', value: vendor.owner_name, required: true },
      { name: 'Business Mobile', value: vendor.mobile, required: true },
      { name: 'Country', value: vendor.country, required: true },
      { name: 'District', value: vendor.district, required: true },
      { name: 'Address', value: vendor.address, required: true },
      { name: 'Website', value: vendor.website, required: false },
      { name: 'Facebook', value: vendor.facebook, required: false },
      { name: 'WhatsApp', value: vendor.whatsapp, required: false },
      { name: 'Profile Image', value: vendor.image || vendor.profile_image, required: false },
    ];

    // Count completed required fields
    const completedCount = fields.filter(f => f.required && f.value).length;
    const requiredCount = fields.filter(f => f.required).length;
    
    // Calculate percentage (only based on required fields)
    const percentage = requiredCount > 0 ? (completedCount / requiredCount) * 100 : 0;
    
    // Get list of missing required fields
    const missingFields = fields
      .filter(f => f.required && !f.value)
      .map(f => f.name);

    return {
      percentage: Math.round(percentage),
      missingFields,
      isComplete: percentage === 100,
      completedCount,
      requiredCount
    };
  }, [vendor]);
};
