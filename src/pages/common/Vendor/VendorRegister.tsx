// src/pages/common/Vendor/VendorRegister.tsx

import RegisterForm from "./RegisterForm";
import RegisterRightSideContent from "./RegisterRightSideContent";

const VendorRegister = () => {
  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left Side - Scrollable Form */}
      <div className="w-full lg:w-1/2 h-screen overflow-y-auto">
        <RegisterForm />
      </div>

      {/* Right Side - Content with Lucide Icons */}
      <RegisterRightSideContent />
    </div>
  );
};

export default VendorRegister;