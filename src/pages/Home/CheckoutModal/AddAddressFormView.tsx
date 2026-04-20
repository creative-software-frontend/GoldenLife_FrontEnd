import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Loader2, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import axios from 'axios';

interface LocationItem {
  id: number | string;
  name?: string;
  name_en?: string;
  name_bn?: string;
}

interface Props {
  onBack: () => void; // Added onBack prop
  onClose: () => void;
  onSave: (addressData: any) => void;
}

export default function AddAddressForm({ onBack, onClose, onSave }: Props) {
  // Base URL & Token
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';
  const getAuthToken = () => {
    const session = sessionStorage.getItem("student_session");
    return session ? JSON.parse(session).token : null;
  };

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Location State
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedThana, setSelectedThana] = useState<string>('');

  // Default Toggle State
  const [isDefault, setIsDefault] = useState(false);

  // Data Lists
  const [divisions, setDivisions] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [thanas, setThanas] = useState<LocationItem[]>([]);

  // UI State
  const [loading, setLoading] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingThanas, setLoadingThanas] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 1. FETCH DIVISIONS
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/divisions`);
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setDivisions(data);
      } catch (err) { console.error(err); }
    };
    fetchDivisions();
  }, []);

  // 2. FETCH DISTRICTS
  const handleDivisionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const divId = e.target.value;
    setSelectedDivision(divId);
    setSelectedDistrict(''); setSelectedThana(''); setDistricts([]); setThanas([]);
    setErrors(prev => ({ ...prev, division: '' }));

    if (divId) {
      setLoadingDistricts(true);
      try {
        const res = await axios.get(`${baseURL}/api/dist-area?id=${divId}`);
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setDistricts(data);
      } catch (err) { console.error(err); } finally { setLoadingDistricts(false); }
    }
  };

  // 3. FETCH THANAS
  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const distId = e.target.value;
    setSelectedDistrict(distId);
    setSelectedThana(''); setThanas([]);
    setErrors(prev => ({ ...prev, district: '' }));

    if (distId) {
      setLoadingThanas(true);
      try {
        const res = await axios.get(`${baseURL}/api/district-wise-Upazila?id=${distId}`);
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setThanas(data);
      } catch (err) { console.error(err); } finally { setLoadingThanas(false); }
    }
  };

  // VALIDATION
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!fullName.trim()) newErrors.fullName = "Required";
    if (!phone.trim()) newErrors.phone = "Required";
    else if (!phoneRegex.test(phone.trim())) newErrors.phone = "Invalid BD Number";
    if (!selectedDivision) newErrors.division = "Required";
    if (!selectedDistrict) newErrors.district = "Required";
    if (!selectedThana) newErrors.thana = "Required";
    if (!address.trim()) newErrors.address = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const token = getAuthToken();

    try {
      const payload = {
        name: fullName,
        phone: phone,
        division_id: selectedDivision,
        district_id: selectedDistrict,
        thana_id: selectedThana,
        address: address,
        is_default: isDefault ? 1 : 0
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      };

      const response = await axios.post(`${baseURL}/api/student/address/store`, payload, config);

      if (response.data) {
        onSave(response.data.data || payload);
      }
    } catch (error) {
      console.error("Failed to save address:", error);
      alert("Failed to save address. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-white font-sans max-h-screen overflow-hidden animate-in slide-in-from-bottom-5 duration-300">

      {/* HEADER WITH BACK BUTTON */}
      <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-100 bg-white shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 -ml-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base md:text-lg font-black text-gray-900 uppercase tracking-tight">New Address</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* FORM */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 scrollbar-hide min-h-0">
        <form id="address-form" onSubmit={handleSubmit} className="space-y-4 pb-4">

          <div className="grid grid-cols-1 gap-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Full Name <span className="text-red-500">*</span></label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. John Doe"
                className={`w-full h-11 px-4 rounded-xl border text-sm focus:outline-none transition-all ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-500'}`} />
            </div>
            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Phone <span className="text-red-500">*</span></label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="017XXXXXXXX"
                className={`w-full h-11 px-4 rounded-xl border text-sm focus:outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-500'}`} />
            </div>
          </div>

          {/* Location Selects */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Division <span className="text-red-500">*</span></label>
            <div className="relative">
              <select value={selectedDivision} onChange={handleDivisionChange} className="w-full h-11 pl-4 pr-10 rounded-xl border text-sm appearance-none bg-white focus:outline-none border-gray-200 focus:border-green-500">
                <option value="" disabled>Select Division</option>
                {divisions.map((div: any) => (<option key={div.id} value={div.id}>{div.name || div.name_en || div.name_bn}</option>))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase px-1">District <span className="text-red-500">*</span>{loadingDistricts && "..."}</label>
            <div className="relative">
              <select value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedDivision} className="w-full h-11 pl-4 pr-10 rounded-xl border text-sm appearance-none bg-white focus:outline-none border-gray-200 focus:border-green-500 disabled:bg-gray-50">
                <option value="" disabled>Select District</option>
                {districts.map((dist: any) => (<option key={dist.id} value={dist.id}>{dist.name || dist.name_en || dist.name_bn}</option>))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Thana <span className="text-red-500">*</span>{loadingThanas && "..."}</label>
            <div className="relative">
              <select value={selectedThana} onChange={e => setSelectedThana(e.target.value)} disabled={!selectedDistrict} className="w-full h-11 pl-4 pr-10 rounded-xl border text-sm appearance-none bg-white focus:outline-none border-gray-200 focus:border-green-500 disabled:bg-gray-50">
                <option value="" disabled>Select Thana</option>
                {thanas.map((thana: any) => (<option key={thana.id} value={thana.id}>{thana.name || thana.name_en || thana.name_bn}</option>))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Address <span className="text-red-500">*</span></label>
            <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Details..." className="w-full h-20 px-4 py-3 rounded-xl border text-sm focus:outline-none border-gray-200 focus:border-green-500 resize-none" />
          </div>

          {/* TOGGLE BUTTON */}
          <label className="flex items-center gap-3 px-1 py-2 mt-2 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                className="sr-only"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
              <div className={`block w-11 h-6 rounded-full transition-colors duration-300 ${isDefault ? 'bg-[#5C9C72]' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 ${isDefault ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
            <span className="text-sm font-bold text-gray-600 select-none group-hover:text-gray-900 transition-colors">
              Set as default address
            </span>
          </label>

        </form>
      </div>

      {/* FOOTER */}
      <div className="p-4 md:p-5 border-t border-gray-100 bg-white shrink-0 z-10 pb-6 md:pb-5">
        <button type="submit" form="address-form" disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 h-12 rounded-xl text-sm font-black uppercase shadow-lg text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Address"}
        </button>
      </div>
    </div>
  );
}