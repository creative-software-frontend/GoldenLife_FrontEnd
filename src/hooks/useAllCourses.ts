import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

export interface Course {
    id: number;
    instructor_id: string;
    course_title_english: string;
    course_title_bangla: string;
    course_type: string;
    course_code: string;
    category: string;
    course_duration: string;
    validity: string;
    seller_fee: string;
    regular_fee: string;
    offer_fee: string;
    download_url: string | null;
    earning_value: string;
    course_details_english: string;
    course_details_bangla: string;
    image: string;
    status: string;
    created_at: string;
    updated_at: string;
    service_type: string;
    instructor?: {
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
        website: string;
        facebook: string;
        telegram: string;
        whatsapp: string;
        mobile: string;
        email: string;
        image: string;
        banner: string;
        created_at: string;
        updated_at: string;
    };
}

export interface AllCoursesResponse {
    status: boolean;
    message: string;
    data: Course[];
}

export interface CourseFilters {
    type?: string;
    search?: string;
    category_id?: string | number;
}

export const useAllCoursesQuery = (filters: CourseFilters = {}) => {
    return useQuery<Course[]>({
        queryKey: ['allCoursesList', filters],
        queryFn: async () => {
            const params: any = {};
            if (filters.type && filters.type !== 'All') params.type = filters.type;
            if (filters.search) params.search = filters.search;
            if (filters.category_id && filters.category_id !== 'all') params.category_id = filters.category_id;

            const response = await axios.get<AllCoursesResponse>(`${baseURL}/api/course/list`, {
                params
            });
            
            if (response.data.status) {
                return response.data.data;
            }
            return [];
        },
    });
};
