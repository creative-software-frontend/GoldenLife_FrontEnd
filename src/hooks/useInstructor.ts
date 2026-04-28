import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

export const useInstructorQuery = (id: string | number | undefined) => {
    return useQuery({
        queryKey: ['instructor', id],
        queryFn: async () => {
            const response = await axios.get(`${baseURL}/api/instructor-wise?id=${id}`);
            return response.data.instructor;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
};
