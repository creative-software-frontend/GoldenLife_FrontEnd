import { StateCreator } from 'zustand';
import axios from 'axios';
import { baseURL, getAuthToken } from '../utils';
import type { AppState } from '../useAppStore';

export interface Transaction {
    id: number;
    amount: string;
    status: string;
    created_at: string;
    type: string;
    payment_method: string;
    number: string;
    Transaction_ID: string | null;
    invoice_number?: string;
    method?: string;
    account?: string;
    date?: string;
    time?: string;
}

export interface WalletSlice {
    walletBalance: string;
    transactions: Transaction[];
    fetchWallet: (silent?: boolean) => Promise<void>;
    fetchHistory: (silent?: boolean) => Promise<void>;
    withdrawFunds: (formData: FormData) => Promise<{ success: boolean; message: string }>;
    setPin: (pinCode: string) => Promise<{ success: boolean; message: string }>;
    searchReceiver: (key: string) => Promise<{ success: boolean; data?: any; message?: string }>;
    sendFunds: (payload: any) => Promise<{ success: boolean; message: string }>;
    sendMoneyCharge: string;
    withdrawCharge: string;
    fetchCharges: () => Promise<void>;
}

export const createWalletSlice: StateCreator<AppState, [], [], WalletSlice> = (set, get) => ({
    walletBalance: "0.00",
    transactions: [],
    sendMoneyCharge: "0.00",
    withdrawCharge: "0.00",

    fetchWallet: async (silent = false) => {
        // Guard: If we're already loading or already have data (and not a silent refresh), skip.
        if (get().isWalletLoading || (get().isWalletFetched && !silent)) return;

        const token = getAuthToken();
        if (!token) return;

        if (!silent) set({ isWalletLoading: true });

        try {
            const isVendor = !!sessionStorage.getItem('vendor_session');
            const url = isVendor 
                ? `${baseURL}/api/vendor/wallet` 
                : `${baseURL}/api/wallet-balance`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Handle vendor response structure vs student
            const data = response.data?.data || response.data;
            const fetchedBalance = data?.balance || data || "0.00";
            
            set({
                walletBalance: Number(fetchedBalance).toFixed(2),
                isWalletFetched: true
            });
        } catch (error) {
            console.error("Wallet Fetch Error:", error);
        } finally {
            if (!silent) set({ isWalletLoading: false });
        }
    },

    fetchHistory: async (silent = false) => {
        // Guard: Use fetched flag for transactions too
        if (get().isWalletLoading || (get().transactions.length > 0 && !silent)) return;

        const token = getAuthToken();
        if (!token) return;

        if (!silent) set({ isWalletLoading: true });

        try {
            const isVendor = !!sessionStorage.getItem('vendor_session');
            const url = isVendor 
                ? `${baseURL}/api/vendor/transactions/history` 
                : `${baseURL}/api/student/transactions`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data?.status === "success" || response.data?.transactions || response.data?.data) {
                const history = response.data.transactions || response.data.data || [];
                set({
                    transactions: history,
                    isWalletFetched: true
                });
            }
        } catch (error) {
            console.error("History Fetch Error:", error);
        } finally {
            if (!silent) set({ isWalletLoading: false });
        }
    },

    withdrawFunds: async (formData: FormData) => {
        const token = getAuthToken();
        if (!token) return { success: false, message: "Authentication required" };

        try {
            const { data } = await axios.post(`${baseURL}/api/transactions`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Don't set Content-Type for FormData
                }
            });

            if (data?.status === 'success' || data?.status === true || data?.success === true) {
                // Update local state silently
                const { fetchNavbarData, fetchHistory } = get();
                await Promise.all([
                    fetchNavbarData(true),
                    fetchHistory(true)
                ]);
                return { success: true, message: data.message || "Withdrawal successful!" };
            } else {
                return { success: false, message: data.message || "Transaction failed." };
            }
        } catch (error: any) {
            console.error("Withdraw Error:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error processing withdrawal."
            };
        }
    },

    setPin: async (pinCode: string) => {
        const token = getAuthToken();
        if (!token) return { success: false, message: "Authentication required" };

        try {
            const formData = new FormData();
            formData.append('pin_code', pinCode);

            const { data } = await axios.post(`${baseURL}/api/set-pin`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data?.status === 'success' || data?.status === true) {
                return { success: true, message: data.message || "4-digit PIN set successfully!" };
            } else {
                return { success: false, message: data.message || "Failed to set PIN." };
            }
        } catch (error: any) {
            console.error("Set Pin Error:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error setting PIN."
            };
        }
    },

    searchReceiver: async (key: string) => {
        const token = getAuthToken();
        try {
            const formData = new FormData();
            formData.append('key', key);

            const { data } = await axios.post(`${baseURL}/api/search-receiver`, formData, {
                headers: { ...(token && { Authorization: `Bearer ${token}` }) }
            });

            if (data?.status === 'success' || data?.status === true) {
                return { success: true, data: data.data };
            } else {
                return { success: false, message: data.message || "User not found." };
            }
        } catch (error: any) {
            console.error("Search Receiver Error:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Unable to verify user."
            };
        }
    },

    sendFunds: async (formData: FormData) => {
        const token = getAuthToken();
        if (!token) return { success: false, message: "Authentication required" };

        try {
            const { data } = await axios.post(`${baseURL}/api/send-money`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (data?.status === 'success' || data?.success) {
                const { fetchWallet, fetchHistory } = get();
                await Promise.all([fetchWallet(true), fetchHistory(true)]);
                return { success: true, message: data.message };
            }

            return { success: false, message: data.message || "Transfer failed." };

        } catch (error: any) {
            // If Laravel returns validation errors, they are inside error.response.data
            const backendMessage = error.response?.data?.errors?.receiver_type?.[0]
                || error.response?.data?.message
                || "Server Error";

            return { success: false, message: backendMessage };
        }
    },

    fetchCharges: async () => {
        const token = getAuthToken();
        try {
            const [sendRes, withdrawRes] = await Promise.all([
                axios.get(`${baseURL}/api/sendMoney_charge`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                }),
                axios.get(`${baseURL}/api/withdraw_charge`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                })
            ]);

            set({
                sendMoneyCharge: sendRes.data?.data || "0.00",
                withdrawCharge: withdrawRes.data?.data || "0.00"
            });
        } catch (error) {
            console.error("Fetch Charges Error:", error);
        }
    }
});