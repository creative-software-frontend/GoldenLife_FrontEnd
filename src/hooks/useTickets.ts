import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getAuthToken, baseURL } from '@/store/utils';

export interface TicketMessage {
    id: number;
    ticket_id: string;
    user_id: number;
    msg: string;
    created_at: string;
    updated_at: string;
}

export interface Ticket {
    id: number;
    student_name: string;
    department: string;
    related_service: string;
    priority: string;
    subject: string;
    description: string;
    image: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    user?: any;
    conversations?: TicketMessage[];
}

interface TicketDetailsResponse {
    ticket: Ticket;
    conversations: TicketMessage[];
}

interface TicketListResponse {
    status: string;
    count: number;
    tickets: Ticket[];
}

const getHeaders = () => {
    const token = getAuthToken();
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
};

export const useTickets = () => {
    return useQuery({
        queryKey: ['tickets'],
        queryFn: async (): Promise<Ticket[]> => {
            const response = await axios.get<TicketListResponse>(`${baseURL}/api/ticket/list`, getHeaders());
            return response.data.tickets;
        },
    });
};

export const useTicketDetails = (id: number | null) => {
    return useQuery({
        queryKey: ['ticket-details', id],
        queryFn: async (): Promise<TicketDetailsResponse> => {
            const response = await axios.get<TicketDetailsResponse>(`${baseURL}/api/ticket/details?id=${id}`, getHeaders());
            return response.data;
        },
        enabled: !!id,
    });
};

export const useCreateTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const token = getAuthToken();
            const response = await axios.post(`${baseURL}/api/ticket/store`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
        },
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ ticketId, msg }: { ticketId: number; msg: string }) => {
            const response = await axios.post(
                `${baseURL}/api/ticket/message/store?id=${ticketId}`,
                { msg },
                getHeaders()
            );
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
            queryClient.invalidateQueries({ queryKey: ['ticket-details', variables.ticketId] });
        },
    });
};
