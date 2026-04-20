import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  owner_name: z.string().min(2, 'Owner name must be at least 2 characters'),
  businee_name: z.string().min(2, 'Business name must be at least 2 characters'),
  mobile_business: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  district: z.string().min(1, 'District is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  website: z.string().url('Invalid URL format').optional().or(z.literal('')),
  facebook: z.string().url('Invalid URL format').optional().or(z.literal('')),
  telegram: z.string().optional(),
  whatsapp: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
