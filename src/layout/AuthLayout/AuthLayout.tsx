import Header from "@/pages/common/Header";
import LandingFooter from "@/pages/common/LandingFooter/LandingFooter";
import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Full-width Header */}
      <div className="w-full">
        <Header />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* WIDTH INCREASED HERE: Changed from sm:max-w-md to sm:max-w-2xl */}
        <div className="w-full sm:max-w-2xl">
          <Outlet />
        </div>
      </main>

      {/* Full-width Footer */}
      <div className="w-full">
        <LandingFooter />
      </div>
      
    </div>
  );
};

export default AuthLayout;