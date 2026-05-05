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

interface Instructor {
  name?: string;
  mobile?: string;
  email?: string;
  gender?: string;
  date_of_birth?: string;
  qualification?: string;
  experience?: string;
  designation?: string;
  department?: string;
  business_name?: string;
  joining_date?: string;
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
 * Calculates profile completion percentage for both Vendors and Instructors
 */
export const useProfileCompletion = (data: Vendor | Instructor | undefined, type: 'vendor' | 'instructor' = 'vendor'): ProfileCompletionResult => {
  return useMemo(() => {
    if (!data) {
      return {
        percentage: 0,
        missingFields: [],
        isComplete: false,
        completedCount: 0,
        requiredCount: type === 'vendor' ? 6 : 8 // Default counts
      };
    }

    let fields: { name: string; value: any; required: boolean }[] = [];

    if (type === 'vendor') {
      const v = data as Vendor;
      fields = [
        { name: 'Business Name', value: v.businee_name || v.owner_name, required: true },
        { name: 'Owner Name', value: v.owner_name, required: true },
        { name: 'Business Mobile', value: v.mobile, required: true },
        { name: 'Country', value: v.country, required: true },
        { name: 'District', value: v.district, required: true },
        { name: 'Address', value: v.address, required: true },
        { name: 'Website', value: v.website, required: false },
        { name: 'Facebook', value: v.facebook, required: false },
        { name: 'WhatsApp', value: v.whatsapp, required: false },
        { name: 'Profile Image', value: v.image || v.profile_image, required: false },
      ];
    } else {
      const i = data as Instructor;
      fields = [
        { name: 'Full Name', value: i.name, required: true },
        { name: 'Mobile Number', value: i.mobile, required: true },
        { name: 'Gender', value: i.gender, required: true },
        { name: 'Date of Birth', value: i.date_of_birth, required: true },
        { name: 'Qualification', value: i.qualification, required: true },
        { name: 'Experience', value: i.experience, required: true },
        { name: 'Designation', value: i.designation, required: true },
        { name: 'Department', value: i.department, required: true },
        { name: 'Academy Name', value: i.business_name, required: false },
        { name: 'Joining Date', value: i.joining_date, required: false },
        { name: 'Profile Image', value: i.image || i.profile_image, required: false },
      ];
    }

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
  }, [data, type]);
};
