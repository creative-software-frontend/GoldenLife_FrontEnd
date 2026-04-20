import { z } from 'zod';

export const instructorProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  gender: z.string().min(1, 'Gender is required'),
  qualification: z.string().min(2, 'Qualification is required'),
  experience: z.string().min(1, 'Experience is required'),
  designation: z.string().min(2, 'Designation is required'),
  department: z.string().min(2, 'Department is required'),
  business_name: z.string().min(2, 'Business name is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  website: z.string().url('Invalid URL format').optional().or(z.literal('')).or(z.null()),
  facebook: z.string().url('Invalid URL format').optional().or(z.literal('')).or(z.null()),
  telegram: z.string().optional().or(z.literal('')).or(z.null()),
  whatsapp: z.string().optional().or(z.literal('')).or(z.null()),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  joining_date: z.string().min(1, 'Joining date is required'),
});

export type InstructorProfileFormData = z.infer<typeof instructorProfileSchema>;
