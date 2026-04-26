import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

const getAuthToken = () => {
    const session = sessionStorage.getItem("instructor_session");
    if (!session) return null;
    try {
        return JSON.parse(session).token;
    } catch (e) {
        return null;
    }
};

export const useInstructorWallet = () => {
    const queryClient = useQueryClient();
    const token = getAuthToken();

    // 1. Fetch Wallet Balance
    const { data: balanceData, isLoading: isBalanceLoading, refetch: refetchBalance } = useQuery({
        queryKey: ['instructor-wallet-balance'],
        queryFn: async () => {
            if (!token) return { balance: "0.00" };
            const { data } = await axios.get(`${baseURL}/api/wallet-balance`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data?.data || { balance: "0.00" };
        },
        enabled: !!token
    });

    // 2. Fetch Transaction History
    const { data: transactionsData, isLoading: isTransactionsLoading, refetch: refetchTransactions } = useQuery({
        queryKey: ['instructor-transactions'],
        queryFn: async () => {
            if (!token) return [];
            const { data } = await axios.get(`${baseURL}/api/student/transactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Based on user input, it might be data.transactions
            return data?.transactions || [];
        },
        enabled: !!token
    });

    // 3. Add Money Mutation
    const addMoneyMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            if (!token) throw new Error("Unauthorized");
            const { data } = await axios.post(`${baseURL}/api/transactions`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data;
        },
        onSuccess: (data) => {
            if (data?.status === 'success' || data?.success) {
                toast.success(data.message || "Request submitted successfully!");
                queryClient.invalidateQueries({ queryKey: ['instructor-wallet-balance'] });
                queryClient.invalidateQueries({ queryKey: ['instructor-transactions'] });
            } else {
                toast.error(data?.message || "Failed to submit request.");
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Internal server error.");
        }
    });

    // 4. Withdraw Money Mutation (Assuming it uses the same /api/transactions endpoint but with type: 'withdraw')
    const withdrawMoneyMutation = useMutation({
        mutationFn: async (payload: any) => {
            if (!token) throw new Error("Unauthorized");
            // Standardize payload if needed
            const { data } = await axios.post(`${baseURL}/api/transactions`, {
                ...payload,
                type: 'withdraw',
                role: '4' // Instructor role
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        },
        onSuccess: (data) => {
            if (data?.status === 'success' || data?.success) {
                toast.success(data.message || "Withdrawal request submitted!");
                queryClient.invalidateQueries({ queryKey: ['instructor-wallet-balance'] });
                queryClient.invalidateQueries({ queryKey: ['instructor-transactions'] });
            } else {
                toast.error(data?.message || "Withdrawal failed.");
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Internal server error.");
        }
    });

    return {
        balance: balanceData?.balance || "0.00",
        transactions: transactionsData || [],
        isBalanceLoading,
        isTransactionsLoading,
        addMoney: addMoneyMutation.mutateAsync,
        isAddingMoney: addMoneyMutation.isPending,
        withdrawMoney: withdrawMoneyMutation.mutateAsync,
        isWithdrawingMoney: withdrawMoneyMutation.isPending,
        refetchBalance,
        refetchTransactions
    };
};
