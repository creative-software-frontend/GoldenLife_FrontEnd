import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

export interface StudentCourse {
    id: number;
    instructor_id: string;
    course_title_english: string;
    course_title_bangla: string;
    course_type: string;
    course_code: string;
    category: string;
    course_duration: string;
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
}

export interface StudentCoursesResponse {
    status: string;
    courses: StudentCourse[];
}

export interface StudentCourseDetailsResponse {
    status: string;
    course: StudentCourse;
    gallery: any[];
}


const getStudentToken = () => {
    const session = sessionStorage.getItem('student_session');
    if (!session) return null;
    try {
        const parsed = JSON.parse(session);
        return parsed.token || null;
    } catch {
        return null;
    }
};

export const useStudentCoursesQuery = () => {
    return useQuery<StudentCourse[]>({
        queryKey: ['studentCourses'],
        queryFn: async () => {
            const token = getStudentToken();
            const headers: Record<string, string> = {
                Accept: 'application/json',
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await axios.get<StudentCoursesResponse>(`${baseURL}/api/student/courses`, {
                headers
            });
            return response.data.courses;
        },
    });
};

export const useStudentCourseDetailsQuery = (id: string | undefined) => {
    return useQuery<StudentCourseDetailsResponse>({
        queryKey: ['studentCourse', id],
        queryFn: async () => {
            const token = getStudentToken();
            const headers: Record<string, string> = {
                Accept: 'application/json',
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await axios.get<StudentCourseDetailsResponse>(`${baseURL}/api/student/course?id=${id}`, {
                headers
            });
            return response.data;
        },
        enabled: !!id,
    });
};
