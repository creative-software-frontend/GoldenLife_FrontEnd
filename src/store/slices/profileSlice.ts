import { StateCreator } from 'zustand';
import axios from 'axios';
import { baseURL, getAuthToken } from '../utils';
import type { AppState } from '../useAppStore';

export interface Student {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    affiliate_id: string;
    mobile: string;
    image: string;
    refer_code: string;
    status: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    student_id?: string;
}


export interface PersonalInfo {
    id: number;
    student_id: string;
    father_name: string;
    mother_name: string;
    date_of_birth: string;
    religion: string;
    gender: string;
    blood_group: string;
    marital_status: string;
    country_name: string;
    division: string;
    district: string;
    upazila_thana_name: string;
    union_word_name: string;
    location: string;
    living_country: string;
    created_at: string;
    updated_at: string;
}

export interface DocumentInfo {
    id: number;
    student_id: string;
    nid_number: string;
    nid_front_page: string;
    nid_back_page: string;
    created_at: string;
    updated_at: string;
}

export interface NomineeInfo {
    id: number;
    student_id: string;
    nominee_name: string;
    nominee_mobile: string;
    nominee_nid_number: string;
    relation_with: string;
    nominee_image: string;
    nominee_nid_front_page: string;
    nominee_nid_back_page: string;
    created_at: string;
    updated_at: string;
}

export interface AdditionalInfo {
    id: number;
    student_id: string;
    education: string;
    profession: string;
    monthly_income: string;
    hobby: string;
    interest: string;
    lifestyle: string;
    facebook_url: string;
    youtube_url: string;
    linkedin_url: string;
    telegram: string;
    x_url: string;
    tiktok_url: string;
    created_at: string;
    updated_at: string;
}

export interface VendorProfile {
    user: {
        id: number;
        name: string;
        email: string;
        mobile: string;
        image?: string;
    };
    vendor: {
        id: number;
        seller_id: string;
        business_name: string;
        owner_name: string;
        image?: string;
    };
}

export interface ProfileSlice {
    studentProfile: Student | null;
    vendorProfile: VendorProfile | null;
    personalInfo: PersonalInfo | null;
    documentInfo: DocumentInfo | null;
    nomineeInfo: NomineeInfo | null;
    additionalInfo: AdditionalInfo | null;
    fetchProfile: (silent?: boolean) => Promise<void>;
    logout: (navigate: (path: string) => void) => void;
}

export const createProfileSlice: StateCreator<AppState, [], [], ProfileSlice> = (set, get) => ({
    studentProfile: null,
    vendorProfile: null,
    personalInfo: null,
    documentInfo: null,
    nomineeInfo: null,
    additionalInfo: null,

    fetchProfile: async (silent = false) => {
        // Refined Guard: Only skip if already fetching PROFILE specifically, 
        // or if already fetched and not a silent refresh.
        if (get().isProfileFetched && !silent) return;

        const token = getAuthToken();
        if (!token) {
            console.warn("⚠️ profileSlice: No auth token found");
            return;
        }

        if (!silent) set({ isProfileLoading: true });

        try {
            // Determine API endpoint based on current path or token type
            const isVendor = window.location.pathname.includes('/vendor');
            const url = isVendor
                ? `${baseURL}/api/vendor/profile`
                : `${baseURL}/api/student/profile`;

            console.log(`📡 profileSlice: Fetching from ${url}`);

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const resData = response.data;
            if (resData?.status === "success" || resData?.vendor) {
                if (isVendor) {
                    set({
                        vendorProfile: {
                            user: resData.user,
                            vendor: resData.vendor
                        },
                        isProfileFetched: true
                    });
                } else {
                    // Update Student Profile with all related info from API
                    set({
                        studentProfile: resData.student,
                        personalInfo: resData.personal_info,
                        documentInfo: resData.document_info,
                        nomineeInfo: resData.nominee_info,
                        additionalInfo: resData.additional_info,
                        isProfileFetched: true
                    });
                }

                // Sync balance with WalletSlice - API returns balance at top level
                const balance = resData.balance || resData.data?.balance;
                if (balance !== undefined) {
                    console.log("💰 profileSlice: Updating wallet balance:", balance);
                    set({ walletBalance: balance.toString() });
                }

                console.log("✅ profileSlice: Profile fetched successfully");
            } else {
                console.warn("⚠️ profileSlice: API returned unexpected structure", resData);
            }
        } catch (error: any) {
            console.error("❌ profileSlice Fetch Error:", error.response?.data || error.message);
        } finally {
            if (!silent) set({ isProfileLoading: false });
        }
    },

    logout: (navigate) => {
        sessionStorage.removeItem("student_session");
        // Reset state across all slices
        set({
            studentProfile: null,
            vendorProfile: null,
            personalInfo: null,
            documentInfo: null,
            nomineeInfo: null,
            additionalInfo: null,
            walletBalance: "0.00",
            categories: [],
            transactions: []
        });
        sessionStorage.removeItem("vendor_session");
        navigate("/login");
        window.location.reload();
    }
});
