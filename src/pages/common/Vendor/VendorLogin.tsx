// src/pages/common/Vendor/VendorLogin.tsx

import VendorLoginNew from "./VendorLoginNew";
import LoginRightSideContent from "./LoginRightSideContent";

const VendorLogin = () => {
  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left Side - Scrollable Form */}
      <div className="w-full lg:w-1/2 h-screen overflow-y-auto relative">
        <VendorLoginNew />
      </div>

      {/* Right Side - Fixed Content */}
      <LoginRightSideContent />
    </div>
  );
};

export default VendorLogin;