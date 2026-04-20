export interface PersonalData {
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
}

export interface DocumentData {
    id: number;
    student_id: string;
    nid_number: string;
    nid_front_page: string | null;
    nid_back_page: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface AdditionalInfoData {
    id: number;
    student_id: string;
    education: string | null;
    profession: string | null;
    monthly_income: string | null;
    hobby: string | null;
    interest: string | null;
    lifestyle: string | null;
    facebook_url: string | null;
    youtube_url: string | null;
    linkedin_url: string | null;
    telegram: string | null;
    x_url: string | null;
    tiktok_url: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface NomineeData {
    id: number;
    student_id: string;
    nominee_name: string | null;
    nominee_mobile: string | null;
    nominee_nid_number: string | null;
    relation_with: string | null;
    nominee_image: string | null;
    nominee_nid_front_page: string | null;
    nominee_nid_back_page: string | null;
    created_at?: string;
    updated_at?: string;
}