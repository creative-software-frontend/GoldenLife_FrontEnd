import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppStore } from '@/store/useAppStore';
import useModalStore from '@/store/modalStore';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

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

export const usePlaceOrder = () => {
    const queryClient = useQueryClient();
    const { fetchWallet, fetchNavbarData } = useAppStore();
    const { triggerWalletUpdate } = useModalStore();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const token = getStudentToken();
            if (!token) throw new Error("No authentication token found. Please login.");

            const response = await axios.post(`${baseURL}/api/student/Orderstore`, formData, {
                headers: {
                    'X-Auth-Token': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        },
        onSuccess: async (data, variables) => {
            if (data?.status === 'success' || data?.success) {
                toast.success(data?.message || "Order placed successfully!");
                
                // Refresh global data
                await Promise.all([
                    fetchWallet(true),
                    fetchNavbarData(true)
                ]);

                // Trigger wallet update if payment method was wallet
                const paymentMethod = variables.get('payment_method');
                if (paymentMethod === 'wallet') {
                    triggerWalletUpdate?.();
                }

                // Invalidate relevant queries if any (e.g. order history)
                queryClient.invalidateQueries({ queryKey: ['student-orders'] });
            } else {
                toast.error(data?.message || "Order placement failed");
            }
        },
        onError: (err: any) => {
            console.error("Order placement failed:", err);
            let msg = "Failed to place order. Please try again.";
            if (err.response?.data?.message) {
                msg = err.response.data.message;
            } else if (err.response?.data?.errors) {
                const firstKey = Object.keys(err.response.data.errors)[0];
                msg = err.response.data.errors[firstKey][0];
            }
            toast.error(msg);
        }
    });
};
