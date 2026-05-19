import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
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
    instructor?: any;
}

export interface AllCoursesResponse {
    status: boolean;
    message: string;
    data: {
        current_page: number;
        data: Course[];
        last_page: number;
        total: number;
    };
}

export interface CourseFilters {
    type?: string;
    search?: string;
    category_id?: string | number;
}

export const useAllCoursesQuery = (filters: CourseFilters = {}) => {
    return useQuery({
        queryKey: ['allCoursesList', filters],
        queryFn: async () => {
            const params: any = {};
            if (filters.type && filters.type !== 'All') params.type = filters.type;
            if (filters.search) params.search = filters.search;
            if (filters.category_id && filters.category_id !== 'all') params.category_id = filters.category_id;

            const response = await axios.get<AllCoursesResponse>(`${baseURL}/api/course/list`, {
                params
            });

            if (response.data.status && response.data.data) {
                return response.data.data;
            }
            return [];
        }
    });
};

export interface CourseDetailsResponse {
    status: boolean;
    message: string;
    data: Course & {
        category: any;
        modules: any[];
        quizzes: any[];
    };
}

export const useCourseDetailsQuery = (id: string | undefined) => {
    return useQuery({
        queryKey: ['courseDetails', id],
        queryFn: async () => {
            const response = await axios.get<CourseDetailsResponse>(`${baseURL}/api/course/details?id=${id}`);
            if (response.data.status) {
                return response.data.data;
            }
            throw new Error(response.data.message);
        },
        enabled: !!id,
    });
};
