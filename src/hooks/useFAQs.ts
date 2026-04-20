import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface FAQ {
    id: number;
    category_id: string;
    question: string;
    answer: string;
    status: string;
    created_at: string;
    updated_at: string;
    category: string | null;
}

interface FAQResponse {
    status: string;
    message: string;
    count: number;
    data: FAQ[];
}

const fetchFAQs = async (search?: string, categoryId?: string): Promise<FAQ[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (categoryId) params.append('category_id', categoryId);

    const url = `https://admin.goldenlifeltd.com/api/get-faqs${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await axios.get<FAQResponse>(url);
    return response.data.data;
};

export const useFAQs = (search?: string, categoryId?: string) => {
    return useQuery({
        queryKey: ['faqs', search, categoryId],
        queryFn: () => fetchFAQs(search, categoryId),
        enabled: true, // Always fetch if search changes or on mount
    });
};
