// src/pages/common/AuthButtons.tsx

import { useNavigate } from "react-router-dom";

export default function AuthButtons() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); 
  };

  const handleRegisterClick = () => {
    navigate('/register'); 
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <button 
        onClick={handleLoginClick}
        className="px-6 py-3 text-sm sm:text-base font-medium rounded-lg bg-black text-white hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
      >
        Login
      </button>
      <button 
        onClick={handleRegisterClick}
        className="px-6 py-3 text-sm sm:text-base font-medium rounded-lg bg-[#FF8A00] text-white hover:bg-orange-600 transition-colors duration-200 cursor-pointer"
      >
        Register
      </button>
    </div>
  );
}