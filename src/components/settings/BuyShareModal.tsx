import {
  X,
  ArrowLeft,
  MapPin,
  ChevronDown,
  Loader2,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Home,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  useDivisions,
  useDistrictsByDivision,
  useUpazilasByDistrict,
  useUnionsByUpazila,
  useBuyShareMutation,
  type ShareType,
} from "@/hooks/useBuyShare";
import { useAppStore } from "@/store/useAppStore";

// Payment method image imports
import bikash from "../../../public/image/payment/bikash.png";
import nogod from "../../../public/image/payment/nogod.png";
import rocket from "../../../public/image/payment/rocket.jpg";

// ─── Share type config ────────────────────────────────────────────────────────

interface ShareTypeOption {
  value: ShareType;
  label: string;
  bn_label: string;
  price: number;
  description: string;
  color: string;
  bgColor: string;
}

const SHARE_TYPES: ShareTypeOption[] = [
  {
    value: "division",
    label: "Divisional - Director",
    bn_label: "বিভাগীয় পরিচালক",
    price: 500000,
    description: "Become a shareholder for a Division (500,000 ৳)",
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
  },
  {
    value: "district",
    label: "District - Organizer",
    bn_label: "জেলা সংগঠক",
    price: 100000,
    description: "Become a shareholder for a District area (1,00,000 ৳)",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
  },
  {
    value: "upazila",
    label: "Thana - Counselor",
    bn_label: "থানা/উপজেলা কাউন্সিলর",
    price: 50000,
    description: "Become a shareholder for an Upazila/Thana area (50,000 ৳)",
    color: "text-teal-700",
    bgColor: "bg-teal-50 border-teal-200",
  },
  {
    value: "union",
    label: "Union - Ambassador",
    bn_label: "ইউনিয়ন অ্যাম্বাসেডর",
    price: 5000,
    description: "Become a shareholder for a Union area (5,000 ৳)",
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
  },
];

// ─── Select component ─────────────────────────────────────────────────────────

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: number; name: string; bn_name?: string }[];
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
}

const StyledSelect = ({
  label,
  value,
  onChange,
  options,
  disabled,
  loading,
  placeholder = "Select…",
}: SelectProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading || options.length === 0}
        className={`w-full appearance-none border rounded-lg px-3 py-2.5 text-sm pr-8 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${disabled || options.length === 0
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : "bg-white border-gray-300 text-gray-800 hover:border-primary cursor-pointer"
          }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name} {opt.bn_name ? `(${opt.bn_name})` : ""}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
        {loading ? (
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </div>
    </div>
  </div>
);

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface BuyShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuyShareModal = ({ isOpen, onClose }: BuyShareModalProps) => {
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [selectedType, setSelectedType] = useState<ShareType | null>(null);
  const [divisionId, setDivisionId] = useState<string>("");
  const [districtId, setDistrictId] = useState<string>("");
  const [upazilaId, setUpazilaId] = useState<string>("");
  const [unionId, setUnionId] = useState<string>("");
  const [agreed, setAgreed] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("wallet");

  const { walletBalance, fetchWallet } = useAppStore();

  // Location queries
  const { data: divisions = [], isLoading: loadingDivisions } = useDivisions();
  const { data: districts = [], isLoading: loadingDistricts } =
    useDistrictsByDivision(divisionId ? Number(divisionId) : null);
  const { data: upazilas = [], isLoading: loadingUpazilas } =
    useUpazilasByDistrict(districtId ? Number(districtId) : null);
  const { data: unions = [], isLoading: loadingUnions } = useUnionsByUpazila(
    upazilaId ? Number(upazilaId) : null
  );

  // Mutation
  const { mutate: buyShare, isPending } = useBuyShareMutation();

  if (!isOpen) return null;

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const shareConfig = SHARE_TYPES.find((s) => s.value === selectedType);

  const isSelectionComplete = () => {
    if (!selectedType || !divisionId) return false;
    if (selectedType === "division") return true;
    if (selectedType === "district") return !!districtId;
    if (selectedType === "upazila") return !!districtId && !!upazilaId;
    if (selectedType === "union")
      return !!districtId && !!upazilaId && !!unionId;
    return false;
  };

  const handleDivisionChange = (v: string) => {
    setDivisionId(v);
    setDistrictId("");
    setUpazilaId("");
    setUnionId("");
  };

  const handleDistrictChange = (v: string) => {
    setDistrictId(v);
    setUpazilaId("");
    setUnionId("");
  };

  const handleUpazilaChange = (v: string) => {
    setUpazilaId(v);
    setUnionId("");
  };

  const handleTypeSelect = (type: ShareType) => {
    setSelectedType(type);
    setDivisionId("");
    setDistrictId("");
    setUpazilaId("");
    setUnionId("");
  };

  const handleProceed = () => {
    if (!isSelectionComplete()) {
      toast.error("Please complete the location selection.");
      return;
    }
    fetchWallet(true);
    setStep("confirm");
  };

  const handleConfirmPurchase = () => {
    if (!agreed) {
      toast.error("Please agree to the terms first.");
      return;
    }
    if (!selectedType || !divisionId) return;

    if (selectedMethod !== "wallet") {
      toast.info(`Gateway payment for ${selectedMethod.toUpperCase()} is currently under maintenance. Please use your Wallet balance.`);
      return;
    }

    const amount = shareConfig?.price ?? 0;
    if (Number(walletBalance) < amount) {
      toast.error(
        `Insufficient wallet balance. Required ৳${amount.toLocaleString()} but you have ৳${Number(
          walletBalance
        ).toFixed(2)}.`
      );
      return;
    }

    const payload: Parameters<typeof buyShare>[0] = {
      share_type: selectedType,
      division_id: Number(divisionId),
      ...(districtId && { district_id: Number(districtId) }),
      ...(upazilaId && { upazila_id: Number(upazilaId) }),
      ...(unionId && { union_id: Number(unionId) }),
    };

    buyShare(payload, {
      onSuccess: (data) => {
        toast.success(
          `🎉 Area share acquired successfully! Designation: ${data.designation}.`
        );
        fetchWallet(true);
        handleClose();
      },
      onError: (err) => {
        toast.error(err.message ?? "Failed to purchase share.");
      },
    });
  };

  const handleClose = () => {
    setStep("select");
    setSelectedType(null);
    setDivisionId("");
    setDistrictId("");
    setUpazilaId("");
    setUnionId("");
    setAgreed(false);
    setSelectedMethod("wallet");
    onClose();
  };

  // ─── Selected location labels ──────────────────────────────────────────────

  const divisionLabel = divisions.find((d) => d.id === Number(divisionId))?.name ?? "";
  const districtLabel = districts.find((d) => d.id === Number(districtId))?.name ?? "";
  const upazilaLabel = upazilas.find((u) => u.id === Number(upazilaId))?.name ?? "";
  const unionLabel = unions.find((u) => u.id === Number(unionId))?.name ?? "";

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4">
      <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-0 md:zoom-in duration-300">

        {/* ── Header ── */}
        <div className="bg-[#5C9C72] text-white p-4 flex items-center gap-3 shrink-0">
          <button
            onClick={step === "confirm" ? () => setStep("select") : handleClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <Home className="w-5 h-5 opacity-80" />
          <h2 className="font-bold text-lg ml-2 flex-1">
            {step === "select" ? "Select Area" : "Membership Payment"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50">

          {/* ========== STEP 1: SELECT ========== */}
          {step === "select" && (
            <div className="space-y-5">

              {/* Classification overview card from 1st image */}
              {/* Classification overview card */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 shadow-sm">
                <div className="flex pb-1.5 border-b border-emerald-200/50">
                  <span className="text-[11px] text-emerald-700 font-bold">Per Share: ৳ 5,000</span>
                </div>


              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                {/* Share type grid */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Select Share Type
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SHARE_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleTypeSelect(type.value)}
                        className={`flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all duration-205 ${selectedType === type.value
                          ? `${type.bgColor} ${type.color} border-primary shadow-sm scale-[1.01]`
                          : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm text-gray-700"
                          }`}
                      >
                        <span className="font-bold text-xs leading-tight">{type.label.split(" (")[0]}</span>
                        <span className="text-[10px] opacity-75 mt-0.5 font-medium">
                          {type.bn_label}
                        </span>
                        <span className="font-bold text-xs mt-2 text-primary">
                          ৳ {type.price.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location dropdowns */}
                {selectedType && (
                  <div className="space-y-3.5 border-t border-gray-100 pt-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Select Location
                    </p>

                    <StyledSelect
                      label="Division (বিভাগ)"
                      value={divisionId}
                      onChange={handleDivisionChange}
                      options={divisions}
                      loading={loadingDivisions}
                      placeholder="Select Division…"
                    />

                    {(selectedType === "district" ||
                      selectedType === "upazila" ||
                      selectedType === "union") && (
                        <StyledSelect
                          label="District (জেলা)"
                          value={districtId}
                          onChange={handleDistrictChange}
                          options={districts}
                          loading={loadingDistricts}
                          disabled={!divisionId}
                          placeholder={divisionId ? "Select District…" : "Select division first"}
                        />
                      )}

                    {(selectedType === "upazila" || selectedType === "union") && (
                      <StyledSelect
                        label="Upazila (উপজেলা)"
                        value={upazilaId}
                        onChange={handleUpazilaChange}
                        options={upazilas}
                        loading={loadingUpazilas}
                        disabled={!districtId}
                        placeholder={districtId ? "Select Upazila…" : "Select district first"}
                      />
                    )}

                    {selectedType === "union" && (
                      <StyledSelect
                        label="Union (ইউনিয়ন)"
                        value={unionId}
                        onChange={setUnionId}
                        options={unions}
                        loading={loadingUnions}
                        disabled={!upazilaId}
                        placeholder={upazilaId ? "Select Union…" : "Select upazila first"}
                      />
                    )}
                  </div>
                )}

                {/* Share type description */}
                {shareConfig && (
                  <div className={`flex items-start gap-2 p-3 rounded-xl border ${shareConfig.bgColor} text-xs`}>
                    <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${shareConfig.color}`} />
                    <p className={`leading-relaxed ${shareConfig.color}`}>
                      {shareConfig.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========== STEP 2: CONFIRM ========== */}
          {step === "confirm" && shareConfig && (
            <div className="space-y-5">

              {/* Order summary card matching 4th image style */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-center font-bold text-gray-800 text-lg mb-5">
                  Pay Now Order
                </h3>

                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Share Type :</span>
                    <span className="font-bold text-gray-800 capitalize">
                      {shareConfig.label}
                    </span>
                  </div>

                  {divisionLabel && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-500">Selected Division :</span>
                      <span className="font-semibold text-gray-800">{divisionLabel}</span>
                    </div>
                  )}

                  {districtLabel && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-500">Selected District :</span>
                      <span className="font-semibold text-gray-800">{districtLabel}</span>
                    </div>
                  )}

                  {upazilaLabel && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-500">Selected Upazila :</span>
                      <span className="font-semibold text-gray-800">{upazilaLabel}</span>
                    </div>
                  )}

                  {unionLabel && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-500">Selected Union :</span>
                      <span className="font-semibold text-gray-800">{unionLabel}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Order Amount :</span>
                    <span className="font-bold text-emerald-600">৳ {shareConfig.price.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                    <span className="text-gray-800 font-bold">Net Payable Amount :</span>
                    <span className="font-bold text-primary text-base">৳ {shareConfig.price.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-slate-100 pt-3 mt-2 flex flex-col gap-2 text-xs">
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Your Wallet Balance :</span>
                      <span className="font-medium text-gray-700">৳ {Number(walletBalance).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-gray-600">Remaining Balance :</span>
                      <span className={Number(walletBalance) >= shareConfig.price ? "text-emerald-600" : "text-destructive"}>
                        ৳ {(Number(walletBalance) - shareConfig.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0 space-y-3.5 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
          {step === "select" ? (
            <button
              onClick={handleProceed}
              disabled={!isSelectionComplete()}
              className={`w-full h-14 rounded-2xl font-black text-[14px] uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                isSelectionComplete()
                  ? "bg-[#5C9C72] hover:bg-[#4a855d] text-white shadow-lg shadow-green-100 active:scale-[0.97]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Proceed to Payment →
            </button>
          ) : shareConfig ? (
            <>
              {/* Payment method row */}
              <div>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Choose Payment Method</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("wallet")}
                    className={`flex-1 py-3.5 rounded-xl text-[14px] font-black border-2 transition-all ${
                      selectedMethod === "wallet"
                        ? "bg-[#5C9C72] text-white border-[#5C9C72] shadow-md"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Wallet
                  </button>
                  <button disabled className="flex-1 py-3.5 rounded-xl text-[14px] font-black border-2 bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed">
                    Bkash
                  </button>
                  <button disabled className="flex-1 py-3.5 rounded-xl text-[14px] font-black border-2 bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed">
                    Nogod
                  </button>
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="share_terms_final"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-6 h-6 rounded border-gray-300 accent-[#5C9C72] cursor-pointer shrink-0 shadow-sm"
                />
                <label htmlFor="share_terms_final" className="text-[15px] text-gray-800 leading-tight cursor-pointer select-none font-bold">
                  I accept the{" "}
                  <a href="/dashboard/help/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#F97316] hover:underline">Privacy Policy</a>
                  {" "}&amp;{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#F97316] hover:underline">Terms</a>.
                </label>
              </div>

              {/* Confirm Purchase button */}
              <button
                onClick={handleConfirmPurchase}
                disabled={!agreed || isPending}
                className={`w-full h-14 rounded-2xl text-[14px] font-black uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                  agreed && !isPending
                    ? "bg-[#5C9C72] hover:bg-[#4a855d] text-white shadow-xl shadow-green-100 active:scale-[0.97]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isPending
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> PROCESSING...</>
                  : `CONFIRM PURCHASE — ৳${shareConfig.price.toFixed(2)}`
                }
              </button>

              {/* Cancel */}
              <button
                onClick={() => setStep("select")}
                disabled={isPending}
                className="w-full h-11 text-gray-400 text-[13px] font-bold uppercase flex items-center justify-center gap-2 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <ArrowLeft size={15} /> Cancel
              </button>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
};
