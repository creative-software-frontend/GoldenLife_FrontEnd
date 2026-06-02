import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { baseURL, getAuthToken } from "@/store/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Division {
  id: number;
  name: string;
  bn_name: string;
  url: string;
}

export interface District {
  id: number;
  division_id: number;
  name: string;
  bn_name: string;
  url: string;
  lat?: string;
  lon?: string;
}

export interface Upazila {
  id: number;
  district_id: number;
  name: string;
  bn_name: string;
  url: string;
}

export interface Union {
  id: number;
  upazilla_id: number;
  name: string;
  bn_name: string;
  url: string;
}

export type ShareType = "division" | "district" | "upazila" | "union";

export interface BuySharePayload {
  share_type: ShareType;
  division_id: number;
  district_id?: number;
  upazila_id?: number;
  union_id?: number;
}

export interface BuyShareResult {
  id: number;
  user_id: number;
  share_type: ShareType;
  designation: string;
  division_id: number;
  district_id: number | null;
  upazila_id: number | null;
  union_id: number | null;
  amount_paid: number;
  payment_method: string;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const authHeaders = () => {
  const token = getAuthToken();
  return token ? { "X-Auth-Token": `Bearer ${token}` } : {};
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Fetch all divisions */
export const useDivisions = () =>
  useQuery<Division[]>({
    queryKey: ["divisions"],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/api/divisions`);
      return res.data?.data ?? [];
    },
    staleTime: 1000 * 60 * 60, // 1 h – static data
  });

/** Fetch districts filtered by division id */
export const useDistrictsByDivision = (divisionId: number | null) =>
  useQuery<District[]>({
    queryKey: ["districts", divisionId],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/api/dist-area?id=${divisionId}`);
      return res.data?.data ?? [];
    },
    enabled: divisionId !== null,
    staleTime: 1000 * 60 * 60,
  });

/** Fetch upazilas filtered by district id */
export const useUpazilasByDistrict = (districtId: number | null) =>
  useQuery<Upazila[]>({
    queryKey: ["upazilas", districtId],
    queryFn: async () => {
      const res = await axios.get(
        `${baseURL}/api/district-wise-Upazila?id=${districtId}`
      );
      return res.data?.data ?? [];
    },
    enabled: districtId !== null,
    staleTime: 1000 * 60 * 60,
  });

/** Fetch unions filtered by upazila id */
export const useUnionsByUpazila = (upazilaId: number | null) =>
  useQuery<Union[]>({
    queryKey: ["unions", upazilaId],
    queryFn: async () => {
      const res = await axios.get(
        `${baseURL}/api/upazila-wise-unions?id=${upazilaId}`
      );
      return res.data?.data ?? [];
    },
    enabled: upazilaId !== null,
    staleTime: 1000 * 60 * 60,
  });

// ─── Mutation ─────────────────────────────────────────────────────────────────

/** POST /api/buy-share */
export const useBuyShareMutation = () =>
  useMutation<BuyShareResult, Error, BuySharePayload>({
    mutationFn: async (payload) => {
      const res = await axios.post(`${baseURL}/api/buy-share`, payload, {
        headers: authHeaders(),
      });
      if (!res.data?.success) {
        throw new Error(res.data?.message ?? "Failed to purchase share.");
      }
      return res.data.data as BuyShareResult;
    },
  });
