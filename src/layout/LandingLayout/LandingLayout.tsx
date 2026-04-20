import React from 'react';
import { Outlet } from "react-router-dom";
// Import the Public/Landing specific components

import LandingFooter from "@/pages/common/LandingFooter/LandingFooter"; 
import Header from '@/pages/common/Header';

const LandingLayout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen font-sans">
            {/* The Orange Header */}
             <Header />

            {/* This renders 'Landing.jsx' in the middle */}
            <main className="flex-grow bg-[#FFF8DC]">
                <Outlet />
            </main>

            {/* The Yellow Footer */}
            <LandingFooter />
        </div>
    );
};

export default LandingLayout;